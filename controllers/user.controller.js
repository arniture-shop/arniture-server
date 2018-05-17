const user = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function validateUsername (uInput,callback) {
  let result = false
  user.find({
      username: uInput
  }).exec()
  .then(function (isFound) {
      if (isFound.length === 0) {
          result = true;
          callback(result)
      } else { 
          result = false;
          callback(result)
      }
  })
}

module.exports = {
  signUp: function (req, res) {
    validateUsername(req.body.email, function (result) {
      if (!result) {
        res.status(400).json({
          message: "email is already used"
        })
      } else {
        let hash = bcrypt.hashSync(req.body.password, 10);
        let newUser = new user({
          email: req.body.email,
          password: hash,
          role: req.body.role
        })
  
        newUser.save(function (err, user) {
          if (err) {
            res.status(500).json({
              message: "fail inserting new user",
              err:err
            })
          } else {
            res.status(201).json({
              message: "insert new user succeed",
              data: user
            })
          }
        })
      }
    })
  },
  signIn: function (req, res) {
    user.findOne({
      email: req.body.email
  }).exec()
    .then(function (user) {
      if (user) {
        let isUser =  bcrypt.compareSync(req.body.password, user.password)
        if (isUser) {
        let token = jwt.sign({role: user.role, id: user._id}, process.env.SECRETKEY)
        res.status(200).json({
          token: token,
          payload: user,
          message: "sign in succeed"
        })
        } else {
          res.status(400).json({
            err:err,
            message:"password is wrong"
          })
        }
      } else {
        res.status(400).json({
          message: 'username is not found'
        })
      }
    })
    .catch(function (err) {
      res.status(500).json({
        err:err,
        message: "fail to sign user in"
      })
    })
  }
}