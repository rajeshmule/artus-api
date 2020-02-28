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
    following: [],
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


const User = model('User', userSchema);
module.exports = User;