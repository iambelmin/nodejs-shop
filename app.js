var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars')
var index = require('./routes/index');
var about = require('./routes/about');
var contact = require('./routes/contact');
var shop = require('./routes/shop');
var admin = require('./routes/admin');
var User = require('./models/user');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var app = express();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

mongoose.connect('mongodb://localhost:27017/shop');
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/*app.use(logger('dev'));*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'kojatajnajarane', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 60 * 1000} 
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public'), {dotfiles: 'allow' } ));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use('/', index);
app.use('/about', about)
app.use('/contact', contact)
app.use('/shop', shop)
app.use('/admin', admin);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
