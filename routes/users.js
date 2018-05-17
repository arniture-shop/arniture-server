const express = require('express')
const router = express.Router()
const ctUser = require('../controllers/user.controller')

router.post('/signup', ctUser.signUp)
router.post('/signin', ctUser.signIn)

module.exports = router
