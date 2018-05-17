const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  }
},{
  timestamps: true
})

let user = mongoose.model('users', userSchema)

module.exports = user