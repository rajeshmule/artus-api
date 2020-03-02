const { Schema, model } = require('mongoose');
const slugify = require('slugify');



const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    description: {
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

articleSchema.pre('save', function (next)
{
    this.slug = slugify(this.title, {
        lower: true
    });
    next();
});


const Article = model('Article', articleSchema);
module.exports = Article;