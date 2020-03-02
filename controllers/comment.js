const Article = require('../models/article');
const Comment = require('../models/comment');
const User = require('../models/user')

exports.getComments = async (req, res, next) =>
{
    try {
        const articleSlug = req.params.slug;
        const article = await Article.findOne({ slug: articleSlug }).populate('comments', '-__v -article');
        const articleId = article.id;
        const comments = await Comment.find({ article: articleId }).sort({ createdAt: 'desc' }).populate('author', '-_id -favorites -email -password -__v -createdAt -updatedAt');
        // console.log(comments);
        res.json({ comments });

    } catch (error) {
        next(error);
    }
}

exports.addComment = async (req, res, next) =>
{
    try {
        const commentBody = req.body.comment;
        const authorId = req.user.userId;
        const articleSlug = req.params.slug;

        const article = await Article.findOne({ slug: articleSlug });
        const articleId = article.id;

        const data = { ...commentBody, author: authorId, article: articleId }
        const createComment = await Comment.create(data);

        const commentId = createComment.id;
        await Article.findByIdAndUpdate(articleId, { $push: { comments: commentId } }, { new: true })

        const newComment = await Comment.findById(commentId).populate('author');

        const { username, bio, image, following } = newComment.author;
        const { id, body, createdAt, updatedAt } = newComment;
        const author = { username, bio, image, following };
        const comment = {
            id, body, createdAt, updatedAt, author
        }

        res.json({ comment });

    } catch (error) {
        next(error);
    }
}

exports.deleteComment = async (req, res, next) =>
{
    try {

        const userId = req.user.userId;
        const articleSlug = req.params.slug;
        const commentId = req.params.id;
        console.log("userId = ", userId, "articleSlug = ", articleSlug, "commentId = ", commentId);

        const comment = await Comment.findById(commentId).populate('author');
        const commentAuthorId = comment.author.id;
        console.log("commentAuthorId = ", commentAuthorId);

        if (userId === commentAuthorId) {
            await Comment.findByIdAndDelete(commentId);
            res.json({ message: "your comment is deleted." })
        } else {
            res.json({ message: "you can't delete this comment." })
        }


    } catch (error) {
        next(error);
    }
}