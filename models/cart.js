const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  },
  quantity: Number,
  totalPrice: Number,
  isCheckout: {
    type: Boolean,
    default: false
  }
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart