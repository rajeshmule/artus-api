const Users = require('../models/user.model');

exports.registerForm = (req, res) =>
{
    res.render('register');
}

exports.registerUser = async (req, res, next) =>
{
    try {
        const userData = req.body;
        await Users.create(userData);
        res.redirect('/users/login');
    } catch (error) {
        next(error);
    }
}

exports.loginForm = (req, res) =>
{
    res.render('login');
}

exports.loginUser = async (req, res, next) =>
{
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) return next(error);
        const isMatch = await user.verifyPassword(password);
        if (!isMatch) return next(error);
        req.session.userid = user.id;
        res.render('hello', { name: user.name });

    } catch (error) {
        next(error);

    }
}