const router = require('express').Router();
const users = require('../controllers/user')
// middleware
const authMiddleware = require('../middleware/authMiddleware')

// users actions

// gif
router.post('/gifs/post', authMiddleware.protect, users.postGIFS);
router.delete('/gifs/delete/:id', authMiddleware.protect, users.deleteGIF);
router.post('/gifs/comments/:id', authMiddleware.protect, users.commentGIF);
router.get('/gifs', users.getAllGifs);

// article
router.post('/articles/write', authMiddleware.protect, users.writeArticle);
router.post('/articles/edit/:id', authMiddleware.protect, users.editArticle);
router.delete('/articles/delete/:id', authMiddleware.protect, users.deleteArticle);
router.post('/articles/comments/:id', authMiddleware.protect, users.commentArticle);
router.get('/articles', users.getAllArticles)



module.exports = router