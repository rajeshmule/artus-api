const { Schema, model } = require('mongoose');

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tagList: [{ type: String }],

    favoritedCount: {
        type: Number,
        default: 0
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });


const Article = model('Article', articleSchema);
module.exports = Article;