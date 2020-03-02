const express = require('express');
const router = express.Router();

const controller = require('../../controllers/article');
const { validateJWT } = require('../../modules/auth');
const { getComments, addComment, deleteComment } = require('../../controllers/comment');

router
    .route('/')
    .post(validateJWT, controller.createArticle)
    .get(controller.listArticle)

router
    .route('/:slug')
    .get(controller.getArticle)
    .put(validateJWT, controller.updateArticle)
    .delete(validateJWT, controller.deleteArticle)

router
    .route('/:slug/favorite')
    .post(validateJWT, controller.favorite)
    .delete(validateJWT, controller.unfavorite)

router
    .route('/:slug/comments')
    .post(validateJWT, addComment)
    .get(getComments)

router
    .route('/:slug/comments/:id')
    .delete(validateJWT, deleteComment)



module.exports = router;