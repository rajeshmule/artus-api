var express = require('express');
var router = express.Router();

const controller = require('../controllers/user');

router
    .route('/register')
    .get(controller.registerForm)
    .post(controller.registerUser)

router
    .route('/login')
    .get(controller.loginForm)
    .post(controller.loginUser)

module.exports = router;
