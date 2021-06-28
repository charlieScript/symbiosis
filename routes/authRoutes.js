const router = require('express').Router()

const users = require('../controllers/user')
const admin = require('../controllers/admin')
const auth = require('../controllers/auth')



router.post('/signup', auth.signup)
router.post('/signin', auth.signin)
router.post('/admin/create', admin.createUser)
router.post('/reset', auth.forgotPassword)
router.post('/reset/:resetToken', auth.resetPassword)


module.exports = router