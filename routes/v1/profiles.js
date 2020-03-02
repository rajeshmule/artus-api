const express = require('express');
const router = express.Router();

const controller = require('../../controllers/user');
const { validateJWT, optionalValidateJWT } = require('../../modules/auth');

router
    .route('/:username')
    .get(optionalValidateJWT, controller.getProfile)

// POST /api/profiles/:username/follow
// DELETE /api/profiles/:username/follow
// Authentication required, returns a Profile

router
    .route('/:username/follow')
    .post(validateJWT, controller.followUser)
    .delete(validateJWT, controller.unfollowUser)


module.exports = router;