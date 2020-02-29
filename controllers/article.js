const Article = require('../models/article');

exports.listArticle = async (req, res, next) =>
{
    try {
        const article = await Article.find().populate('author');
        // const articles = {
        //     slug: article.slug,
        //     title: article.title,
        //     description: article.description,
        //     body: article.body,
        //     tagList: article.tagList,
        //     createdAt: article.createdAt,
        //     updatedAt: article.updatedAt,
        //     favorited: article.favorited,
        //     favoritesCount: article.favoritesCount,
        //     author: {
        //         username: article.author.username,
        //         bio: article.author.bio,
        //         image: article.author.image,
        //         following: article.author.following
        //     }
        // }
        // console.log(article.author);


        res.json({ articles: [article] })
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

    } catch (error) {
        next(error);
    }
}

exports.deleteArticle = async (req, res, next) =>
{
    try {
        const slug = req.params.slug;
        await Article.findOneAndDelete({ slug });
        // const article = await Article.findOne({ slug }).populate('author');
        // const newArticle = {
        //     slug: article.slug,
        //     title: article.title,
        //     description: article.description,
        //     body: article.body,
        //     tagList: article.tagList,
        //     createdAt: article.createdAt,
        //     updatedAt: article.updatedAt,
        //     favorited: article.favorited,
        //     favoritesCount: article.favoritesCount,
        //     author: {
        //         username: article.author.username,
        //         bio: article.author.bio,
        //         image: article.author.image,
        //         following: article.author.following
        //     }
        // }

        res.json("article deleted")

    } catch (error) {
        next(error);
    }
}