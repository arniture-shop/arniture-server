const Cart = require('../models/cart')
const jwt = require('jsonwebtoken')

module.exports = {
  addToCart (req, res) {
    let token = req.headers.token
    let decoded = jwt.verify(token, process.env.SECRETKEY)
    Cart.findOne({
      userId: decoded.id,
      itemId: req.body.itemId
    })
    .then(item => {
      if(item){
        Cart.findOneAndUpdate({
          userId: decoded.id,
          itemId: req.body.itemId
        },{
          $set: {
            quantity: item.quantity+1,
            totalPrice: item.totalPrice/item.quantity + item.totalPrice
          }
        })
        .then(data => {
          res.status(201).json({
            message: 'Added Item to Cart',
            data
          })
        })
      } else {
        console.log('masuk else')
        const item = new Cart ()
        item.userId = decoded.id
        item.itemId = req.body.itemId
        item.quantity = req.body.quantity
        item.totalPrice = req.body.totalPrice
        item.save()
        .then(data => {
          res.status(201).json({
            message: 'Added New Item to Cart',
            data
          })
        })
        .catch(err => {
          res.send(err)
        })
      }
    })
  },
  showCart (req, res) {
    let token = req.headers.token
    let decoded = jwt.verify(token, process.env.SECRETKEY)
    Cart.find({userId: decoded.id})
    .populate('itemId')
    .exec()
    .then(item => {
      res.status(200).json({
        message: 'Cart',
        item
      })
    })
  },
  checkout: function (req, res) {
    Cart.findOneAndUpdate({_id: req.params._id}, {$set: {isCheckout: true}})
    .then(data => {
      res.status(201).json({
        message: 'Checkout',
        data
      })
    })
  }
}