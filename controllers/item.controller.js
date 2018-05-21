const Item = require('../models/items')

module.exports = {
  create: function (req, res) {
    let item = new Item()
    item.name = req.body.name
    item.description = req.body.description
    item.price = req.body.price
    item.img = req.body.img
    item.item_obj = req.body.item_obj,
    item.item_mtl = req.body.item_mtl.split(',')
    item.scale = []
    let scale = req.body.scale.split(',')
    scale.forEach(num => {
      item.scale.push(+num)
    })
    item.save()
    .then(data => {
      res.status(201).json({
        message: 'New item added',
        data
      })
    })
    .catch(err => {
      res.status(400).json({
        message: 'Error add item',
        err
      })
    })
  },
  readAll: function (req, res) {
    Item.find()
    .then(items => {
      res.status(200).json({
        message: 'List all item',
        items
      })
    })
  },
  readOne: function (req, res) {
    Item.findById(req.params._id)
    .then(item => {
      res.status(200).json({
        message: 'Item data',
        item
      })
    })
    .catch(err => {
      message: 'Item not found',
      err
    })
  },
  update: function (req, res) {
    Item.findOneAndUpdate({_id : req.params._id}, {$set: req.body}, {upsert: true})
    .then(item => {
      res.status(200).json({
        message: 'Update item success',
        item
      })
    })
    .catch(err => {
      res.status(400).json({
        message: 'Update failed',
        err
      })
    })
  },
  del: function (req, res) {
    Item.remove({_id: req.params._id})
    .then(item => {
      res.status(200).json({
        message: 'Delete success',
        item
      })
    })
    .catch(err => {
      res.status(400).json({
        message: 'Delete failed',
        err
      })
    })
  }
}