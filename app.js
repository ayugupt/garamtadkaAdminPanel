var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const multer = require('multer');
var upload = multer({dest:'uploads/'});

var app = express();

const AWS = require('aws-sdk');
const fs = require('fs');
const util = require('util');
var path = require('path');

AWS.config.update({
    accessKeyId: "AKIAQ62ZT6HUDBUOSMUZ",
    secretAccessKey: "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"
})

var s3 = new AWS.S3();

var params = {
  Bucket: "garamtadka",
}

const s3Actions = {
  upload: (config)=>{
      return util.promisify(s3.upload).call(s3, config);
  }
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/pages/category.html', function(req, res, next){
  if(req.query.password == "garamtadka"){
    next();
  }else{
    res.status(403).send({
      message:"wrong password"
    })
  }
})

app.use(express.static(path.join(__dirname, 'public')));

app.post('/uploadCategoryImage', upload.single('categoryImage'), async function(req, res){
  params.Body = fs.createReadStream(path.join(__dirname, `./uploads/${req.file.filename}`));
  params.Key = `categories/${req.body.categoryName}.${req.body.imageType}`;
  let uploadResult = await s3Actions.upload(params);
  res.send({message:"Successful", imageLink:uploadResult.Location});
  fs.unlink(path.join(__dirname, `./uploads/${req.file.filename}`), function(){
    console.log("deleted")
  })
})


app.use('/', function(req, res, next){
  res.sendFile(path.join(__dirname, "./public/pages/login.html"));
})

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
