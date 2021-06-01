const router = require('express').Router()

const users = require('../controllers/user')
const admin = require('../controllers/admin')


//  signup 
router.post('/signup', users.signup)


// sign in
router.post('/signin', users.signup)

// admin create
router.post('/admin/create', admin.createUser)



module.exports = router