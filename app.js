if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const routes = require('./routes/index');
const userRoutes = require('./routes/users');

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash'); //used to show messages when redirecting
const session = require('express-session');
const passport = require('passport');


const app = express();

// Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to mongo
mongoose.connect(db, { useNewUrlParser: true})
  .then(()=>console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser to ge data in the form of req.body
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(session ({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars for color msgs
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//routes
app.use('/', routes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, console.log(`Server started on port ${PORT}`));
