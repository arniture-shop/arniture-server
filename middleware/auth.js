const jwt = require('jsonwebtoken')

module.exports = {
  isUser: function (req, res, next) {
    let token = req.headers.token
    if (token) {
      console.log(token);
      let decode = jwt.verify(token, process.env.SECRETKEY)
      if (decode) {
          next()
      } else {
          res.status(403).json({
              message: "you are not user"
          })
      }
    } else {
      res.status(403).json({
          message: "not sign in yet"
      })
    }
  },

  isAdmin: function (req, res, next) {
    let token = req.headers.token
    if (token) {
      let decode = jwt.verify(token, process.env.SECRETKEY)
      if (decode.role === "admin") {
        next()
      } else {
        res.status(401).json({
        message: "you are not admin"
        })
      }
    } else {
      res.status(403).json({
      message: "not sign in yet"
      })
    }
  }
}