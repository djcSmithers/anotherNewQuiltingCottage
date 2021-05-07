const User = require('../models/user');
const Image = require('../models/image');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// const { url } = require('node:inspector');
// const {validationResult} = require('express-validator/check');

/***************************************************************************
 * Post Login
 ****************************************************************************/
 exports.login = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let loadedUser;

    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this username could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                    username: loadedUser.username,
                    userId: loadedUser._id.toString()
                },
                'pLOw!r2VGVszbWX{606e,FeBA]Q<+_', { expiresIn: '1h' }
            );
            res.status(200).json({ token: token, userId: loadedUser._id.toString(), username: loadedUser.username });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


/***************************************************************************
 * TEMP signup
 ****************************************************************************/
/*
exports.signup = (req, res, next) => {

    let username = req.body.username;
    let password = req.body.password;

    bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({
          username: username,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
          return res.status(201).json({message: "User created"});
      }).catch(err => {
        console.log(err);
    })

}
*/




// app.use(multer({storage: storage}).array('images'));

/***************************************************************************
 * Post Add Images
 ****************************************************************************/
exports.postAddImages = (req, res, next) => {

    let images = [];

    const url = req.protocol + "://" + req.get("host");

    for (file of req.files){

        let path = url + '/' + file.filename;

        let newPath = path.replace(/ /g,"_");

        let newFileName = file.filename.replace(/ /g,"_");

        // console.log(path);

        let image = new Image({
            imageName: newFileName,
            imagePath: newPath
        });
        images.push(image);
    }

    const options = { ordered: true };
    Image.insertMany(images, options).then(result => {
        return res.status(201).json({message: "Upload Successful!"});
    }).catch(err => {
        console.log(err);
    })

    // image.insertMany(images).then(result => {
    //     return res.status(200).json({message: "Upload Successful"});
    // });

    // images.save().then(result => {
    //     res.status(201).json({
    //         message: "Image uploaded successfully"
    //     }).catch(err => console.log(err));
    // }).catch(err => { console.log(err); });

    // return res.status(200).json({message: "Upload Successful"});

}


exports.getGallery = (req, res, next) => {
    Image.find()
        .then((images) => {
            res.status(200).json({
                images: images,
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({message: "Internal Server Error"});
        });
}

exports.deleteImage = (req, res, next) => {

    Image.find({_id: req.params.id}).then(image => {

        //If the image is found, delete it from the file system synchronously
        fs.unlinkSync('public/' + image[0].imageName);

        //Attempt to delete the image (Using deleteMany as even though it's a single, it's stored as an array)
        Image.deleteMany({_id: req.params.id}).then(result => {
            return res.status(200).json({message: "Image deleted successfully"});
        }).catch(err => {
            console.log(err);
            return res.status(500).json({err: "Internal Server Error"});
        })

    //If the image can't be found
    }).catch(err => {
        console.log(err);
        return res.status(404).json({err: "Image not found in database"});
    })
}



//If the image is found, delete it from the file system synchronously
// Image.find({_id: req.params.id}).then(image => {
    // fs.unlinkSync('public/' + image[0].imageName).catch(err => {
    //     if (err){
    //         console.log(err);
    //     }
    // });
// });