const express = require('express');
const router = express.Router();

const controller = require('../../controllers/user');
const { validateJWT } = require('../../modules/auth');

router
    .route('/')
    .get(validateJWT, controller.getCurrentUser)
    .put(validateJWT, controller.updateUser)

module.exports = router;