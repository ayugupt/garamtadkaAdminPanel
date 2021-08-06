require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const got = require('got')

const multer = require('multer');
var upload = multer({dest:'uploads/'});
var FormData = require('form-data')

var app = express();

// const fs = require('fs');
// const util = require('util');
var path = require('path');
dateParser = require('./dateParser.js')

// const AWS = require('aws-sdk');
// AWS.config.update({
//     accessKeyId: "AKIAQ62ZT6HUDBUOSMUZ",
//     secretAccessKey: "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"
// })

// var s3 = new AWS.S3();

// var params = {
//   Bucket: "garamtadka",
// }

// const s3Actions = {
//   upload: (config)=>{
//       return util.promisify(s3.upload).call(s3, config);
//   }
// }

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, './public/pages/login.html'));
})

app.post('/authenticatePassword', upload.none(), async function(req, res){
  try{
    let form = new FormData();
    form.append("password", req.body.password)
    let auth = await got.post(`${process.env.SERVERADDRESS}/authenticateAdminPassword`, {
      body: form,
      responseType:"json"
    })

    if(auth.body.valid){
      res.cookie('isLoggedIn', true);
      res.status(200).send({
        message:auth.body.message,
        correct: true
      })
    }else{
      res.status(200).send({
        correct: false,
        message:auth.body.message
      })
    } 
  }catch(error){
    res.status(400).send({
      message: error,
      correct: false
    })
  }
})

app.use(function(req, res, next){
  if(req.cookies.isLoggedIn || !req.url.includes("pages")){
    next();
  }else{
    res.status(403).send({
      message:"Not Logged In",
    })
  }
})

app.use(express.static(path.join(__dirname, 'public')));


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
