const Article = require('../models/article');
const User = require('../models/user');

exports.listArticle = async (req, res, next) =>
{
    try {
        let query = {};
        let limit = req.query.limit || 20;
        let offset = req.query.offset || 0;
        let username = req.query.author || null;
        let favoriter = req.query.favorited || null;
        const userId = req.user ? req.user.userId : null;
        let user;

        if (typeof req.query.limit !== 'undefined') {
            limit = req.query.limit;
        }

        if (typeof req.query.offset !== 'undefined') {
            offset = req.query.offset;
        }

        if (typeof req.query.tag !== 'undefined') {
            query.tagList = { "$in": [req.query.tag] };
        }

        if (username) {
            const author = await User.findOne({ username });
            if (author) {
                query.author = author.id;
            }
        }

        if (favoriter) {
            query._id = { $in: favoriter.favorites };
        } else if (req.query.favorited) {
            query._id = { $in: [] };
        }

        const articles = await Article.find(query)
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .populate('author')
            .exec();

        const articlesCount = await Article.estimatedDocumentCount(query).exec();
        if (userId) {
            user = await User.findById(userId);
        }

        // console.log("pathname", req.baseUrl);

        if (req.baseUrl === '/api/v1/articles') {

            return res.json({
                articles: articles.map(function (article)
                {
                    return article.toJSONFor(user);
                }),
                articlesCount: articlesCount
            });
        } else {
            res.render('articles', { articles });
        }

    } catch (error) {
        next(error);
    }
}

exports.createArticle = async (req, res, next) =>
{
    try {
        const data = req.body.article;
        const authorId = req.user.userId;
        data.author = authorId;
        const user = await User.findById(authorId);
        const createdArticle = await Article.create(data);
        const article = await Article.findById(createdArticle.id).populate('author');

        res.json({ article: article.toJSONFor(user) });

    } catch (error) {
        next(error);
    }

}


exports.getArticle = async (req, res, next) =>
{
    try {
        const slug = req.params.slug;
        const userId = req.user ? req.user.userId : null;
        const articleData = await Article.findOne({ slug })
            .populate('author')
            .populate('comments');

        const user = await User.findById(userId)
        const article = articleData.toJSONFor(user);


        res.json({ article })
    } catch (error) {
        next(error);
    }
}

exports.updateArticle = async (req, res, next) =>
{
    try {
        const slug = req.params.slug;
        const article = await Article.findOne({ slug }).populate('author');
        if (article) {
            if (req.user.userId === article.author.id) {
                const data = req.body.article;
                const article = await Article.findOneAndUpdate({ slug }, data);
                if (article) {
                    const article = await Article.findOne({ slug }).populate('author');

                    res.json({ article: article.toJSONFor(user) })
                }
                else {
                    res.json({ "message": "you can't update this article" });
                }

            }
        } else {
            res.json({ "message": "article not present" })
        }

    } catch (error) {
        next(error);
    }
}

exports.deleteArticle = async (req, res, next) =>
{
    try {
        const slug = req.params.slug;
        const currentUserId = req.user.userId;

        const article = await Article.findOne({ slug }).populate('author');
        const author = article.author;
        const authorId = author.id;

        if (currentUserId === authorId) {
            await Article.findOneAndDelete({ slug });
            res.json({ "message": "article deleted" });
        } else {
            res.json({ "message": "you can't delete this article" });
        }

    } catch (error) {
        next(error);
    }
}


exports.favorite = async (req, res, next) =>
{
    try {
        const slug = req.params.slug;

        const article = await Article.findOne({ slug });
        if (article) {
            const articleId = article.id;
            const count = await User.countDocuments({ favorites: { $in: [articleId] } })
            if (!count) {
                const userId = req.user.userId;
                await User.findByIdAndUpdate(userId, { $push: { favorites: articleId } }, { new: true });
                const count = await User.countDocuments({ favorites: { $in: [articleId] } })

                await Article.findByIdAndUpdate(articleId, { favoritedCount: count });
                const article = await Article.findById(articleId).populate('author', '-password');

                res.json({ article: article.toJSONFor(user) })
            } else {
                res.json({ "message": "you have like this article." })
            }
        } else {
            res.json({ "message": "article not exist." })
        }
    } catch (error) {

        next(error);
    }
}

exports.unfavorite = async (req, res, next) =>
{
    try {
        const slug = req.params.slug;

        const article = await Article.findOne({ slug });
        if (article) {
            const articleId = article.id;
            const count = await User.countDocuments({ favorites: { $in: [articleId] } })
            if (count) {
                const userId = req.user.userId;
                await User.findByIdAndUpdate(userId, { $pull: { favorites: articleId } }, { new: true });
                const count = await User.countDocuments({ favorites: { $in: [articleId] } })
                await Article.findByIdAndUpdate(articleId, { favoritedCount: count });
                const article = await Article.findById(articleId).populate('author');
                res.json({ article: article.toJSONFor(user) })
            } else {
                res.json({ "message": "you dont have like." })
            }
        } else {
            res.json({ "message": "article not exist." })
        }
    } catch (error) {
        next(error);
    }
}

exports.feedArticle = async (req, res, next) =>
{
    try {
        let query = {};
        let limit = req.query.limit || 20;
        let offset = req.query.offset || 0;
        const userId = req.user.userId
        const user = await User.findById(userId)
        if (user) {
            const userFollowing = user.following;
            const articles = await Article.find({ author: { $in: userFollowing } })
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({ createdAt: 'desc' })
                .populate('author')
                .exec();

            const articlesCount = await Article.estimatedDocumentCount(query).exec();
            res.json({
                articles: articles.map(function (article)
                {
                    return article.toJSONFor(user);
                }),
                articlesCount: articlesCount
            });

        } else {
            res.json({ "message": "token error." })
        }

    } catch (error) {
        next(error);
    }
}


//routes for backend app

