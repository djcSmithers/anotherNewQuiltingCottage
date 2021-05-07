const express=require('express');
const bodyParser = require('body-parser')
const cors = require('./../cors');
const emailRouter = express.Router();
const nodemailer = require('nodemailer');

exports.sendMail = (req, res, next) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'cj13810@gmail.com',//replace with your email
          pass: 'cj013810'//replace with your password
        },
        tls: {rejectUnauthorized: false}
      });

    let mailOptions = {
        from: 'cj13810@gmail.com', //Also April's email? Sending it to herself?
        to: 'twda96@gmail.com', //This should be April's email
        //req.body.email //This has the email that was sent in the body of the form 
        // to: 'twda96@gmail.com, cj13810@gmail.com', //Use this format to send to multiple people
        subject: `Quilting Order`,
        html:"Thanks for the order:\n" + req.body.name + " " +  req.body.email+" bodybodybody"
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return res.status(500).json({message: "a;slgna;ganr;eg"});
        } else {
          return res.status(200).json({message: "Email sent"});
        }
      });

};