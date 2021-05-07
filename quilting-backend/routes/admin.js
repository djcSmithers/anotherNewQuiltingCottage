const express = require('express');
const user = require('../models/user');
const isAuth = require('../middleware/isAuth')
const adminController = require('../controllers/admin');
const multer = require('multer');

const router = express.Router();


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
  }

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //   cb(null, __dirname + '/uploads')      //Path to upload files
          cb(null, './public')
    },
    filename: function (req, file, cb) {
    //   cb(null, file.fieldname + '-' + Date.now() + '.png')
    const ext = MIME_TYPE_MAP[file.mimetype];
    let newFileName = file.originalname.replace(/ /g,"_");
    cb(null, newFileName + '-' + Date.now() + '.' + ext);
    }
  });

  var upload = multer({storage: storage,
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...')
    },
});



router.post('/login', adminController.login);

router.get('/gallery', adminController.getGallery);

router.delete('/delete/:id', isAuth, adminController.deleteImage);

// router.post('/signup', adminController.signup);


router.post('/images', isAuth, upload.array('images'), adminController.postAddImages);

module.exports = router;




// router.post('/images', isAuth, adminController.postAddImages);
// router.post('/images', upload.array('images'), adminController.postAddImages);