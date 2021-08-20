const jwt = require('jsonwebtoken')
const {TOKEN_SECRET} = require('../../config/secret')

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if(token) {
    jwt.verify(token, TOKEN_SECRET, (err, decodedToken) => {
      if(err) {
        next({status:401, message: 'token invalid'})
      } else {
        req.decodedToken = decodedToken
        next()
      }
    })
  }else{
    next({status: 400, message: 'token required'})
  }
};
