// require modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var helmet = require('helmet');
var hpp = require('hpp');

// declare router
var indexRouter = require('./routes/index');
var musicRouter = require('./routes/music');
var searchRouter = require('./routes/search');
var guitarRouter = require('./routes/guitar');
var uploadRouter = require('./routes/upload');
var authRouter = require('./routes/auth');
var mypageRouter = require('./routes/mypage');
var aboutRouter = require('./routes/about');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(hpp());

// session handler
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

// connect router
app.use('/', indexRouter);
app.use('/music', musicRouter);
app.use('/search', searchRouter);
app.use('/guitar', guitarRouter);
app.use('/upload', uploadRouter);
app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/aboutus', aboutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
