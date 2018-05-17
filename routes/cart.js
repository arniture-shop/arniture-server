const express = require('express')
const router = express.Router()
const { addToCart, showCart } = require('../controllers/cart.controller')
const { isUser, isAdmin } = require('../middleware/auth')

router.post('/', addToCart)
router.get('/', showCart)

module.exports = router
