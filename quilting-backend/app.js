var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var emailRouter = require('./routes/emailRouter');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const MONGODB_URI = 'mongodb+srv://dataUser:eT1iDCv2VskXvd9U@cluster0.wum7a.mongodb.net/quiltingCottage?retryWrites=true&w=majority';
// const MONGODB_URI = 'mongodb+srv://dataUser:eT1iDCv2VskXvd9U@cluster0.cgnnu.mongodb.net/quiltingCottage';


const MONGODB_URI = `mongodb+srv://${process.env.userName}:${process.env.userPassword}@cluster0.wum7a.mongodb.net/${process.env.databaseName}?retryWrites=true&w=majority`;



//Multer for Images//

const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    //TODO: Remove this if it gives problems because multiple file upload
    // const isValid = MIME_TYPE_MAP[file.mimetype];
    // let error = new Error("Invalid mime type");
    // if (isValid) {
    //   error = null;
    // }
    
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    // cb(null, new Date().toISOString() + '-' + file.originalname);
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '-' + ext);
  }
});


/////////////////////////////////////

const adminData = require('./routes/admin');
// let filesRouter = require('./routes/files'); //import route to files.js

// mongodb+srv://dataUser:kq45ZAyhYNc9VlLk@cluster0.wum7a.mongodb.net/quiltingCottage?retryWrites=true&w=majority

//mongodb+srv://dataUser:kq45ZAyhYNc9VlLk@cluster0.cgnnu.mongodb.net/quiltingCottage


const PORT = process.env.PORT || 3000;

var app = express();
app.use(cors());


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
// app.use('/images', express.static(path.join("src/quilting-backend/public/images")));
// app.use("/images", express.static(path.join("quilting-backend/public/images")));
// app.use("/images", express.static(path.join("/quilting-backend/images")));

// app.use('/', indexRouter);

// app.use((req, res, next) => {
//   // * = any, can be set to specific domains
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });


app.use('/users', usersRouter);
app.use('/admin', adminData);
app.use('/email', emailRouter);
// app.use('/files', filesRouter); //Use route to files.js

// app.use(multer({storage: storage}).array('images'));


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// client.connect(err => {
//   const collection = client.db("quiltingCottage").collection("Users");
//   // perform actions on the collection object
//   client.close();
// });

app.use((error, req, res, next) => {
  console.log(error);
  // res.status(500).render('500', {
  //   pageTitle: 'Error!',
  //   path: '/500',
  //   isAuthenticated: req.session.isLoggedIn
  // });
});


mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(PORT);
        console.log("Listening on port " + PORT);
    })
    .catch(err => {
        console.log(err);
    });

module.exports = app;
