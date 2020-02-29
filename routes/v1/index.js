const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const userRouter = require('./user');
const profilesRouter = require('./profiles');
const articlesRouter = require('./articles');

router.get('/', (req, res) =>
{
    res.json({ message: "Welcome to conduit API" })
});

router.use('/users', usersRouter);
router.use('/user', userRouter);
router.use('/profiles', profilesRouter);
router.use('/articles', articlesRouter);

module.exports = router;