const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }

}, { timestamps: true });

// Requires population of author
commentSchema.methods.toJSONFor = function (user)
{
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        author: this.author.toProfileJSONFor(user)
    };
};

const Comment = model('Comment', commentSchema);
module.exports = Comment;