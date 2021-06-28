const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const fs = require('fs');

// upload function
const upload = require('../utils/upload');

/**
 * @desc    User post a gif
 * @route   POST /api/v1/users/gif/post?=category=`categories`
 * @access  Private
 * @argument { gif: gif_file, category: `work_related ||tech_related || world_related`}
 */
const postGIFS = async (req, res) => {
  const email = req.user;
  console.log(email);
  const category = req.query.category;
  const schema = joi.object({
    email: joi.string().email().required(),
    category: joi.string().required(),
  });
  const validation = schema.validate({
    email,
    category,
  });
  if (validation.error) {
    return res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }
  try {
    // the upload function
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          status: '400',
          error: err,
        });
      } else {
        // checks if file is undefined
        if (req.file == undefined) {
          return res.status(400).json({
            status: '400',
            error: 'please input a file',
          });
        }
        // checks the required query and add to category
        if (
          category === 'work_related' ||
          category === 'tech_related' ||
          category === 'world_related'
        ) {
          prisma.gifs
            .create({
              data: {
                category: category,
                flag: 'appropriate',
                gif_file_path: req.file.filename,
                posted_by: email,
              },
            })
            .then(() => {
              res.status(200).json({
                status: '400',
                file: `uploads/${req.file.filename}`,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                status: '500',
                error: 'an  internal error occurred',
              });
            });
        } else {
          res.status(400).json({
            status: '500',
            error: 'please check the required parameter',
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

/**
 * @desc    User write an article
 * @route   POST /api/v1/users/article/write
 * @access  Private
 * @argument "article_title": "a country",
	"article_content": "Lorem ipsum dolor si?",
	"category": "world_related"
 */
const writeArticle = async (req, res) => {
  const email = req.user;
  const { article_title, article_content, category } = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    article_title: joi.string().required(),
    article_content: joi.string().required(),
    category: joi.string().required(),
  });
  const validation = schema.validate({
    email,
    article_content,
    article_title,
    category,
  });
  if (validation.error) {
    return res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }

  try {
    // checks the required body and add to category
    if (
      category === 'work_related' ||
      category === 'tech_related' ||
      category === 'world_related'
    ) {
      const user = await prisma.articles.create({
        data: {
          article_title: article_title,
          article_content: article_content,
          flag: 'appropriate',
          uploaded: false,
          category: category,
          posted_by: email,
        },
      });
      res.status(201).json({
        status: 201,
        message: 'article created',
      });
    } else {
      console.log(error);
      res.status(400).json({
        status: '400',
        error: 'please check the body',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

/**
 * @desc    User write an article
 * @route   POST /api/v1/users/article/edit/:id
 * @access  Private
 * @argument "article_title": "a country",
	"article_content": "Lorem ipsum dolor si?",
 * @param id article id
 */
const editArticle = async (req, res) => {
  const email = req.user;
  const id = req.params.id;
  const { article_title, article_content, category } = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    article_title: joi.string().required(),
    article_content: joi.string().required(),
    id: joi.number().required(),
  });
  const validation = schema.validate({
    email,
    article_content,
    article_title,
    id,
  });
  if (validation.error) {
    return res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }
  try {
    // find the article through the parameter passed
    const findArticle = await prisma.articles.findMany({
      where: {
        posted_by: email,
        article_id: Number(id),
      },
    });
    // if article is found
    if (findArticle.length !== 0) {
      await prisma.articles.update({
        where: {
          article_id: findArticle[0].article_id,
        },
        data: {
          article_content,
          article_title,
        },
      });
      res.status(201).json({
        status: '201',
        message: 'article changed',
      });
    } else {
      // if article is not found
      res.status(404).json({
        status: '404',
        error: 'article not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

/**
 * @desc    User delete an article
 * @route   POST /api/v1/users/article/delete/:id
 * @access  Private
 * @param id article id
 */
const deleteArticle = async (req, res) => {
  const email = req.user;
  const id = req.params.id;
  const schema = joi.object({
    email: joi.string().email().required(),
    id: joi.number().required(),
  });
  const validation = schema.validate({
    email,
    id,
  });
  if (validation.error) {
    return res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }
  try {
    // find the article through the parameter passed
    const findArticle = await prisma.articles.findMany({
      where: {
        posted_by: email,
        article_id: Number(id),
      },
    });
    // if article is found
    if (findArticle.length !== 0) {
      await prisma.articles.delete({
        where: {
          article_id: findArticle[0].article_id,
        },
      });
      res.status(201).json({
        status: '201',
        message: 'article deleted',
      });
    } else {
      // if article is not found
      res.status(404).json({
        status: '404',
        error: 'article not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

/**
 * @desc    User deletes a gif
 * @route   POST /api/v1/users/gif/post?=category=`categories`
 * @access  Private
 * @argument
 */
const deleteGIF = async (req, res) => {
  const email = req.user;
  const id = req.params.id;
  const schema = joi.object({
    email: joi.string().email().required(),
    id: joi.number().required(),
  });
  const validation = schema.validate({
    email,
    id,
  });
  if (validation.error) {
    return res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }
  try {
    // find the gif through the parameter passed
    const findGif = await prisma.gifs.findMany({
      where: {
        posted_by: email,
        gif_id: Number(id),
      },
    });

    // if the gif is found
    if (findGif.length !== 0) {
      // search for file
      const file = await fs.promises.readFile(
        `./public/uploads/${findGif[0].gif_file_path}`,
      );
      // delete gif from database
      await prisma.gifs.delete({
        where: {
          gif_id: findGif[0].gif_id,
        },
      });
      // if file is found
      if (file) {
        await fs.promises.unlink(
          `./public/uploads/${findGif[0].gif_file_path}`,
        );
        res.status(200).json({
          status: '200',
          message: 'gif deleted',
        });
      }
    } else {
      res.status(404).json({
        status: '404',
        error: 'gif not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

/**
 * @desc    User comments on a gif
 * @route   POST /api/v1/users/gif/comment/:commentid`
 * @access  Private
 * @argument
 */
const commentGIF = async (req, res) => {
  const email = req.user;
  const id = req.params.id;
  const { comment_content } = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    id: joi.number().required(),
    comment_content: joi.string().required(),
  });
  const validation = schema.validate({
    email,
    id,
    comment_content,
  });
  if (validation.error) {
    return res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }

  try {
    // 1. find the gif and check if its available
    const gif = await prisma.gifs.findUnique({
      where: {
        gif_id: Number(id),
      },
    });

    // 2. If the gif is available add the comments to the gifs comment table
    if (gif) {
      const comment = await prisma.gifs_comments.create({
        data: {
          comment_content: comment_content,
          posted_by: email,
          gif_id: gif.gif_id,
        },
      });
      res.status(201).json({
        status: '200',
        message: `comment added to ${gif.posted_by} gif post by ${email}`,
      });
    } else {
      // 3. if gif is not found
      res.status(404).json({
        status: '404',
        error: 'gif not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

/**
 * @desc    User comments on an article
 * @route   POST /api/v1/users/articles/comments/:commmentid`
 * @access  Private
 * @argument
 */
const commentArticle = async (req, res) => {
  const email = req.user;
  const id = req.params.id;
  const { comment_content } = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    id: joi.number().required(),
    comment_content: joi.string().required(),
  });
  const validation = schema.validate({
    email,
    id,
    comment_content,
  });
  if (validation.error) {
    return res.status(400).json({
      status: '400',
      error: validation.error.message,
    });
  }

  try {
    // 1. find the gif and check if its available
    const article = await prisma.articles.findUnique({
      where: {
        article_id: Number(id),
      },
    });

    // 2. If the gif is available add the comments to the gifs comment table
    if (article) {
      const comment = await prisma.articles_comments.create({
        data: {
          comment_content: comment_content,
          posted_by: email,
          article_id: article.article_id,
        },
      });
      res.status(201).json({
        status: '200',
        message: `comment added to ${article.posted_by} gif post by ${email}`,
      });
    } else {
      // 3. if gif is not found
      res.status(404).json({
        status: '500',
        error: 'article not found',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

/**
 * @desc    User views all articles
 * @route   POST /api/v1/users/articles`
 * @access  Private
 * @argument
 */
const getAllArticles = async (req, res) => {
  try {
    // gets all articles
    const articles = await prisma.articles.findMany({
      // orderBy: {
      //   createdAt: SortOrder.desc,
      // },
    });
    res.status(200).json({
      status: '200',
      message: articles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

/**
 * @desc    User views all articles
 * @route   POST /api/v1/users/articles`
 * @access  Private
 * @argument
 */
const getAllGifs = async (req, res) => {
  try {
    // gets all articles
    const gifs = await prisma.gifs.findMany({
      // orderBy: {
      //   createdAt: SortOrder.desc,
      // },
    });
    res.status(200).json({
      status: '200',
      message: gifs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: '500',
      error: 'an  internal error occurred',
    });
  }
};

// init
const users = {
  postGIFS,
  writeArticle,
  editArticle,
  deleteArticle,
  deleteGIF,
  commentGIF,
  commentArticle,
  getAllArticles,
  getAllGifs
};

module.exports = users;
