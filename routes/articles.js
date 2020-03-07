var express = require('express');
var router = express.Router();

const controller = require('../controllers/article');
const { addComment } = require('../controllers/comment');

router
    .route('/')
    .get(controller.listArticle)

router
    .route('/:slug')
    .get(controller.getArticle)

router
    .route('/:slug/comments')
    .post(addComment)

module.exports = router;