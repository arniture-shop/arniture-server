const mongoose = require('mongoose')

let itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    require: true
  },
  img: {
    type: String,
    require: true
  },
  item_obj: {
    type: String,
    required: true,
  },
  item_mtl: {
    type: String,
    required: true,
  }
},{
  timestamps: true
})

let Item = mongoose.model('Item', itemSchema)

module.exports = Item