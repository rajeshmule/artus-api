const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true });

//hashing a password before saving it to the database
// userSchema.pre('save', async function (next)
// {
//     await bcrypt.hashSync(this.password, 10);
//     next();
// })
userSchema.pre('save', function (next)
{
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.verifyPassword = function (password)
{
    return bcrypt.compareSync(password, this.password);
};


const Users = model('Users', userSchema);
module.exports = Users;