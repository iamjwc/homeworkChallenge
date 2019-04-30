var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tokensRouter = require('./routes/tokens');
var restaurantsRouter = require('./routes/restaurants');
var ordersRouter = require('./routes/orders');
let routeHelpers = require('./routes/helpers');

var app = express();

// Set up Mongo connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/interviewHomeworkDevelopment', {useNewUrlParser: true});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

 // parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tokens', tokensRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/orders', ordersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  routeHelpers.handleError(err, res);
});

module.exports = app;
