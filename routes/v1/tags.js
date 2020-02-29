const express = require('express');
const router = express.Router();

const Article = require('../../models/article')

router.get('/', async (req, res) =>
{
    try {
        const tags = await Article.find().distinct('tagList');
        res.json({ tags });

    } catch (error) {
        next(error);
    }

});

module.exports = router;