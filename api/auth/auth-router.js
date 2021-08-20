const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./user-model')
const {TOKEN_SECRET} = require('../../config/secret')

// Generating our token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "7d",
  };
  return jwt.sign(payload, TOKEN_SECRET, options);
}

router.post('/register', validateUser, async (req, res, next) => {
    try{
      let {username, password} = req.body;
      const otherAccount = await User.findBy({username})
      const hash = bcrypt.hashSync(password, 7);
      req.body.password = hash;

      if(otherAccount.length === 0){
        User.add(req.body)
          .then(newUser => {
            res.status(201).json(newUser)
          })
          .catch(next)
      }else{
        res.status(500).json({message: 'username taken'})
      }

    }catch(error){
      next(error)
    }
});

router.post('/login', validateUser, (req, res, next) => {
    let { username, password } = req.body;

    User.findBy({ username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            res.status(200).json({
              message: `Welcome ${user.username}!`,
              token, 
            });
          } else {
            next({status: 401, message: 'invalid credentials'})
          }
        })
        .catch(next)
});

// Validating User
function validateUser(req, res, next) {
  if(!req.body.username || !req.body.password) {
    res.status(400).json({ message: 'username and password required'})
  }else{
    next()
  }
}

module.exports = router;
