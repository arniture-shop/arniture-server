const express = require('express')
const router = express.Router()
const { addToCart, showCart, checkout,clear, increaseQuantity, decreaseQuantity} = require('../controllers/cart.controller')
const { isUser, isAdmin } = require('../middleware/auth')

router.post('/', addToCart)
router.get('/', showCart)
router.put('/:_id', checkout)
router.put('/increase/:id', increaseQuantity)
router.put('/decrease/:id', decreaseQuantity)
router.delete('/:_id', clear)

module.exports = router
