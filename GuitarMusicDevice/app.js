// require modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// declare router
var indexRouter = require('./routes/index');
var musicRouter = require('./routes/music');
var searchRouter = require('./routes/search');
var guitarRouter = require('./routes/guitar');
var uploadRouter = require('./routes/upload');
var authRouter = require('./routes/auth');
var mypageRouter = require('./routes/mypage');
var moreRouter = require('./routes/more');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect router
app.use('/', indexRouter);
app.use('/music', musicRouter);
app.use('/search', searchRouter);
app.use('/guitar', guitarRouter);
app.use('/upload', uploadRouter);
app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/more', moreRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
