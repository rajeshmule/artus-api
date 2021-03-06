const express = require('express');
const router = express.Router();

const controller = require('../../controllers/user');

router
    .route('/')
    .post(controller.register);

router
    .route('/login')
    .post(controller.login);

module.exports = router;