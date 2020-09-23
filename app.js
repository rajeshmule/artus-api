var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require("cors");
const fs = require('fs');
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

var indexRouter = require('./routes/index');
const v1Router = require('./routes/v1/index');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_ADDON_URI, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  serverSelectionTimeoutMS: 5000
}, () =>
{
  console.log(`mongodb connected`);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
// initialize body-parser to parse incoming parameters requests to req.body
app.use(express.urlencoded({ extended: false }));
// connect static content which place in public dir when we want to use static content like css images like /images/name.jpg
app.use(express.static(path.join(__dirname, 'public')));

// router for Home-Page
app.use('/', indexRouter);
app.use('/api/v1', v1Router);

app.get('/docs', function (req, res)
{
  // Allow the docs.html template to 'include' markdown files
  var convertmd = function (filename)
  {
    var path = __dirname + "/" + filename;
    var include = fs.readFileSync(path, 'utf8');
    var html = md.render(include);
    return html;
  };
  res.render('docs', { convertmd });
});
// catch 404 and forward to error handler
app.use(function (req, res, next)
{
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next)
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
