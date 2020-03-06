var express = require('express');
var router = express.Router();

const controller = require('../controllers/article');

router
    .route('/')
    .get(controller.listArticle)

router
    .route('/:slug')
    .get(controller.getArticle)

module.exports = router;