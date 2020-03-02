const express = require('express');
const router = express.Router();

const controller = require('../../controllers/article');
const { validateJWT, optionalValidateJWT } = require('../../modules/auth');
const { getComments, addComment, deleteComment } = require('../../controllers/comment');

router
    .route('/')
    .post(validateJWT, controller.createArticle)
    .get(optionalValidateJWT, controller.listArticle)

router
    .route('/feed')
    .get(validateJWT, controller.feedArticle)

router
    .route('/:slug')
    .get(optionalValidateJWT, controller.getArticle)
    .put(validateJWT, controller.updateArticle)
    .delete(validateJWT, controller.deleteArticle)

router
    .route('/:slug/favorite')
    .post(validateJWT, controller.favorite)
    .delete(validateJWT, controller.unfavorite)

router
    .route('/:slug/comments')
    .post(validateJWT, addComment)
    .get(optionalValidateJWT, getComments)

router
    .route('/:slug/comments/:id')
    .delete(validateJWT, deleteComment)


module.exports = router;