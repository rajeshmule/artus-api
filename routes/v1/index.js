const express = require('express');
const router = express.Router();


const usersRouter = require('./users');
const userRouter = require('./user');
const profilesRouter = require('./profiles');
const articlesRouter = require('./articles');
const tagsRouter = require('./tags');

router.get('/', (req, res) =>
{
    res.json({ message: "Wellcome to artus API." });  // res.json({ message: "Welcome to artus API" })
});

router.use('/users', usersRouter);
router.use('/user', userRouter);
router.use('/profiles', profilesRouter);
router.use('/articles', articlesRouter);
router.use('/tags', tagsRouter)

module.exports = router;