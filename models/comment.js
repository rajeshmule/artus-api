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

const Comment = model('Comment', commentSchema);
module.exports = Comment;