const Article = require('../models/article');
const User = require('../models/user');

exports.listArticle = async (req, res, next) =>
{
    try {
        const articles = await Article.find({}).populate('author');

        const listarticles = articles.map((article) =>
        {
            const { username, bio, image, following } = article.author;
            const { slug, title, description, body, tagList, createdAt, updatedAt, favorited, favoritesCount } = article;
            const author = { username, bio, image, following };
            newArticle = {
                slug,
                title,
                description,
                body,
                tagList,
                createdAt,
                updatedAt,
                favoritesCount,
                favorited,
                author
            }
            return newArticle;
        })



        res.json({ listarticles });
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
        const createdArticle = await Article.create(data);
        console.log(createdArticle.id);
        const article = await Article.findById(createdArticle.id).populate('author');
        const newArticle = {
            slug: article.slug,
            title: article.title,
            description: article.description,
            body: article.body,
            tagList: article.tagList,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            favorited: article.favorited,
            favoritesCount: article.favoritesCount,
            author: {
                username: article.author.username,
                bio: article.author.bio,
                image: article.author.image,
                following: article.author.following
            }
        }

        console.log(newArticle);

        res.json({ newArticle });

    } catch (error) {
        next(error);
    }

}


exports.getArticle = async (req, res, next) =>
{
    try {
        const slug = req.params.slug;
        console.log(slug);
        const article = await Article.findOne({ slug }).populate('author');
        const newArticle = {
            slug: article.slug,
            title: article.title,
            description: article.description,
            body: article.body,
            tagList: article.tagList,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            favorited: article.favorited,
            favoritesCount: article.favoritesCount,
            author: {
                username: article.author.username,
                bio: article.author.bio,
                image: article.author.image,
                following: article.author.following
            }
        }

        res.json({ newArticle })

    } catch (error) {
        next(error);
    }
}

exports.updateArticle = async (req, res, next) =>
{
    try {
        const slug = req.params.slug;
        const data = req.body.article;
        console.log(data);

        const currentUserId = req.user.userId;
        // const article = await Article.findOne({ slug }).populate('author');
        const article = await Article.findOne({ slug }).populate('author');
        const authorId = article.author.id;
        if (currentUserId === authorId) {

            await Article.findOneAndUpdate({ slug }, data);
            const article = await Article.findOne({ slug }).populate('author');
            const newArticle = {
                slug: article.slug,
                title: article.title,
                description: article.description,
                body: article.body,
                tagList: article.tagList,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                favorited: article.favorited,
                favoritesCount: article.favoritesCount,
                author: {
                    username: article.author.username,
                    bio: article.author.bio,
                    image: article.author.image,
                    following: article.author.following
                }
            }

            res.json({ newArticle })
        } else {
            res.json("you can't update this article");
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
        // console.log("from auth userId", userId);
        // console.log(slug);
        const article = await Article.findOne({ slug }).populate('author');
        const author = article.author;
        const authorId = author.id;
        // console.log("article userId", author.id);
        if (currentUserId === authorId) {
            await Article.findOneAndDelete({ slug });
            res.json("article deleted");
        } else {
            res.json("you can't delete this article");
        }

    } catch (error) {
        next(error);
    }
}


exports.favorite = async (req, res, next) =>
{
    try {
        const slug = req.params.slug;
        const userId = req.user.userId;
        // console.log("from auth userId", userId);
        // console.log("slug", slug);
        const articleId = await (await Article.findOne({ slug })).id;
        const count = await User.countDocuments({ favorites: { $in: [articleId] } })
        if (!count) {
            await User.findByIdAndUpdate(userId, { $push: { favorites: articleId } }, { new: true });
            const count = await User.countDocuments({ favorites: { $in: [articleId] } })
            // console.log(count);
            await Article.findByIdAndUpdate(articleId, { favoritedCount: count });
            const article = await Article.findById(articleId).populate('author');
            // console.log(article);
            res.json({ article })

        } else {
            res.json({ "message": "you have like." })
        }

    } catch (error) {
        next(error);
    }
}

exports.unfavorite = async (req, res, next) =>
{
    try {
        const slug = req.params.slug;
        const userId = req.user.userId;
        // console.log("from auth userId", userId);
        // console.log("slug", slug);
        const articleId = await (await Article.findOne({ slug })).id;
        const count = await User.countDocuments({ favorites: { $in: [articleId] } })
        if (count) {
            await User.findByIdAndUpdate(userId, { $pull: { favorites: articleId } }, { new: true });
            const count = await User.countDocuments({ favorites: { $in: [articleId] } })
            // console.log(count);
            await Article.findByIdAndUpdate(articleId, { favoritedCount: count });
            const article = await Article.findById(articleId).populate('author');
            // console.log(article);
            res.json({ article })

        } else {
            res.json({ "message": "you dont have like." })
        }
    } catch (error) {
        next(error);
    }
}