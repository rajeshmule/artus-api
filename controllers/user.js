const User = require('../models/user');
const { generateJWT } = require('../modules/auth');


// register for api 
exports.register = async (req, res, next) =>
{
    try {
        const data = req.body.user;

        const user = await User.create(data);

        const token = await generateJWT(user);

        const userinfo = {
            email: user.email,
            token,
            username: user.username,
            bio: user.bio,
            image: user.image
        }
        res.json({ user: userinfo });
    } catch (err) {
        next(err);
    }
}

// for api login

exports.login = async (req, res, next) =>
{
    try {
        const { email, password } = req.body.user;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Please enter a valid email" });
        const isMatch = await user.verifyPassword(password);
        if (!isMatch) return res.status(400).json({ error: "Invalid Password" });
        const token = await generateJWT(user);
        const userinfo = {
            email: user.email,
            token,
            username: user.username,
            bio: user.bio,
            image: user.image
        }
        res.json({ usre: userinfo });
    } catch (err) {
        next(err);
    }
}

// get current user for api

exports.getCurrentUser = async (req, res, next) =>
{
    try {
        const id = req.user.userId
        const user = await User.findById(id);
        const { email, username, bio, image } = user;
        const userinfo = {
            email, username, bio, image
        }
        res.json({ user: userinfo });
    } catch (err) {
        next(err);
    }

}

// update user 

exports.updateUser = async (req, res, next) =>
{
    try {
        const id = req.user.userId;
        const updatedData = req.body.user;
        const updateUser = await User.findByIdAndUpdate(id, updatedData);
        const user = await User.findById(updateUser.id);
        const { email, username, bio, image } = user;
        const userinfo = {
            email, username, bio, image
        }
        res.json({ user: userinfo });

    } catch (err) {
        next(err);
    }
}

// get profile


exports.getProfile = async (req, res, next) =>
{
    try {
        const userName = req.params.username;
        const user = await User.findOne({ username: userName }).populate('following');
        if (user) {
            const { username, bio, image } = user;
            const userinfo = {
                username, bio, image
            }
            res.json({ profile: userinfo });
        } else {
            res.json({ profile: "Not found." });
        }
    } catch (err) {
        next(err);
    }
}


// Follow user


exports.followUser = async (req, res, next) =>
{
    try {
        const userId = req.user.userId;
        const username = req.params.username;
        const profile = await User.findOne({ username });

        if (profile) {
            const following = profile.following.includes(userId);

            if (!following) {
                const userProfile = await User.findOneAndUpdate({ username: req.params.username }, { $push: { following: req.user.userId } }, { new: true });
                const { username, bio, image } = userProfile;
                const following = userProfile.following.includes(userId);
                const profile = {
                    username, bio, image, following
                }
                res.json({ profile });
            } else {
                res.json("you are following.");
            }

        } else {
            res.json({ "message": "profile not found." })
        }

    } catch (err) {
        next(err);
    }
}

// Unfollow user

exports.unfollowUser = async (req, res, next) =>
{
    try {
        const userId = req.user.userId;
        const username = req.params.username;
        const userProfile = await User.findOne({ username });
        const following = userProfile.following.includes(userId);
        if (following) {
            const userProfile = await User.findOneAndUpdate({ username: req.params.username }, { $pull: { following: req.user.userId } }, { new: true });
            const following = userProfile.following.includes(userId);
            const { username, bio, image } = userProfile;
            const profile = {
                username, bio, image, following
            }
            res.json({ profile });
        } else {
            res.json("you are not following.");
        }

    } catch (err) {
        next(err);
    }
}


// for backend  artus app 

exports.registerForm = (req, res) =>
{
    res.render('register');
}

exports.registerUser = async (req, res, next) =>
{
    try {
        const userData = req.body;
        await User.create(userData);
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
        const user = await User.findOne({ email });
        if (!user) return next("user not match");
        const isMatch = await user.verifyPassword(password);
        if (!isMatch) return next(error);
        res.redirect('/articles');
    } catch (error) {
        next(error);

    }
}