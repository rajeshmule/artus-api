const express = require('express');
const router = express.Router();

const controller = require('../../controllers/article');
const { validateJWT } = require('../../modules/auth');

router
    .route('/')
    .post(validateJWT, controller.createArticle)
    .get(controller.listArticle)

router
    .route('/:slug')
    .get(controller.getArticle)
    .put(validateJWT, controller.updateArticle)
    .delete(validateJWT, controller.deleteArticle)


module.exports = router;