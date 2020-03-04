const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String
    },
    image: {
        type: String
    },
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }],
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

userSchema.pre('save', function (next)
{
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.verifyPassword = function (password)
{
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isFavorite = function (id)
{
    return this.favorites.some(function (favoriteId)
    {
        return favoriteId.toString() === id.toString();
    });
}
userSchema.methods.isFollowing = function (id)
{
    return this.following.some(function (followId)
    {
        return followId.toString() === id.toString();
    });
};

userSchema.methods.toProfileJSONFor = function (user)
{
    return {
        username: this.username,
        bio: this.bio,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
        following: user ? user.isFollowing(this._id) : false
    };
};


const User = model('User', userSchema);
module.exports = User;