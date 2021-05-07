const express = require('express');
const emailController = require('../controllers/email');

const router = express.Router();

router.post('/', emailController.sendMail);

module.exports = router;