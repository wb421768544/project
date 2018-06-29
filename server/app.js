var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var objMulter = multer({
  dest: './public/images/'
});
var session = require('express-session');


var index = require('./routes/index');
var users = require('./routes/users');

var api = require('./routes/api');
var login = require('./routes/login');
var submit = require('./routes/submit');
var article = require('./routes/article');
var author = require('./routes/author');
var add = require('./routes/add');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//template engine
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(objMulter.any());
app.use(cookieParser('wb_session_id'));
app.use(express.static(path.join(__dirname, 'public')));

//session
app.use(session({
  secret: 'wb_session_id',
  resave: true,
  saveUnitialized: false,
  rolling: true,
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}));

//initialize session.users,and solving cross-domain problems
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
  res.setHeader('Access-Control-Allow-Credentials', true);
  req.session.users = req.session.users || {};
  req.session.id = {};
  next();
});

//router
app.use('/login', login);
app.use('/', index);
app.use('/api', api);
app.use('/users', users);
app.use('/submit', submit);
app.use('/article', article);
app.use('/author', author);
app.use('/add', add);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;