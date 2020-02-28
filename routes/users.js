const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Login page
router.get('/login', (req, res) => res.render('login'));

// Register page
router.get('/register', (req, res) => res.render('register'));

//Register handle
router.post('/register', (req,res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if(!name || !password || !email || !password2) {
    errors.push({ msg: 'Please fill in all fields'});
  }

  if(password !== password2) {
    errors.push({ msg: 'Passwords do not match'});
  }

  if(password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if(errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else{
    // Validation passed
    User.findOne({ email: email })
      .then(user => {
        if(user) {
          errors.push({ msg: 'Email is already registered'});
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else{
          const newUser = new User({
            name,
            email,
            password
          });

          //Hash password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;

              newUser.password = hash;

              newUser.save()
              .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err))
            }) )
          // console.log(newUser);
          // res.send('Hello ');
        }
      });
  }

})

module.exports = router;
