const express = require('express')
const router = express.Router()
const {create, readAll, readOne, update, del } = require('../controllers/item.controller')

router.post('/', create)
router.get('/', readAll)
router.get('/:_id', readOne)
router.put('/:_id', update)
router.delete('/:_id', del)

module.exports = router
