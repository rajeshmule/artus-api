# Welcome to artus Node API

`fatch api on this url` http://artus-api.herokuapp.com/api/v1

### ARTUS API Spec

### Authentication Header:

`Authorization: Token jwt.token.here`

### JSON Objects returned by API:

Make sure the right content type like `Content-Type: application/json; charset=utf-8` is correctly returned.

### Users (for authentication)

```json
{
  "user": {
    "email": "rajesh@rajesh.com",
    "token": "jwt.token.here",
    "username": "rajesh",
    "bio": "learn to code",
    "image": null
  }
}
```

### Profile

```JSON
{
  "profile": {
    "username": "rajesh",
    "bio": "learn to code",
    "image": "sample.jpg",
    "following": false
  }
}
```

### Single Article

```JSON
{
  "article": {
    "slug": "learn-html",
    "title": "learn html whith rupali",
    "description": "learn html",
    "body": "only html",
    "tagList": [
      "Html",
      "ui",
      "front-end"
    ],
    "createdAt": "2020-03-02T14:30:33.997Z",
    "updatedAt": "2020-03-02T16:54:09.736Z",
    "favorited": false,
    "author": {
      "username": "rupali",
      "bio": "I like to code.",
      "following": []
    }
  }
}
```

### Multiple Articles

```JSON
{
  "articles":[{
    "slug": "learn-html",
    "title": "learn html whith rupali",
    "description": "learn html",
    "body": "only html",
    "tagList": [
      "Html",
      "ui",
      "front-end"
    ],
    "createdAt": "2020-03-02T14:30:33.997Z",
    "updatedAt": "2020-03-02T16:54:09.736Z",
    "favorited": false,
    "author": {
      "username": "rupali",
      "bio": "I like to code.",
      "following": []
    }
  }
  }, {
    "slug": "learn-html",
    "title": "learn html whith rupali",
    "description": "learn html",
    "body": "only html",
    "tagList": [
      "Html",
      "ui",
      "front-end"
    ],
    "createdAt": "2020-03-02T14:30:33.997Z",
    "updatedAt": "2020-03-02T16:54:09.736Z",
    "favorited": false,
    "author": {
      "username": "rupali",
      "bio": "I like to code.",
      "following": []
    }
  }],
  "articlesCount": 2
}
```

### Single Comment

```JSON
{
  "comment": {
    "id": "5e5d35745c006c22c513045a",
    "body": "Goog Article 10 03",
    "createdAt": "2020-03-02T16:33:56.987Z",
    "updatedAt": "2020-03-02T16:33:56.987Z",
    "author": {
      "username": "rulpali",
      "bio": "I like to code.",
      "following": []
    }
  }
}
```

### Multiple Comments

```JSON
{
  "comments": [{
    "id": "5e5d35745c006c22c513045a",
    "body": "Goog Article 10 03",
    "createdAt": "2020-03-02T16:33:56.987Z",
    "updatedAt": "2020-03-02T16:33:56.987Z",
    "author": {
      "username": "rulpali",
      "bio": "I like to code.",
      "following": []
    }
  }]
}
```

### List of Tags

```JSON
{
  "tags": [
    "html",
    "css"
  ]
}
```

### Errors and Status Codes

If a request fails any validations, expect a 422 and errors in the following format:

```JSON
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```

#### Other status codes:

401 for Unauthorized requests, when a request requires authentication but it isn't provided

403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request

## Endpoints:

### Authentication:

`POST /users/login`

Example request body:

```JSON
{
  "user":{
    "email": "rajesh@rajesh.com",
    "password": "rajesh"
  }
}
```

No authentication required, returns a [User](#users-for-authentication)

Required fields: `email`, `password`

### Registration:

`POST /users`

Example request body:

```JSON
{
  "user":{
    "username": "rajesh",
   "email": "rajesh@rajesh.com",
    "password": "rajesh"
  }
}
```

No authentication required, returns a [User](#users-for-authentication)

Required fields: `email`, `username`, `password`

### Get Current User

`GET /user`

Authentication required, returns a [User](#users-for-authentication) that's the current user

### Update User

`PUT /user`

Example request body:

```JSON
{
  "user":{
    "email": "rajesh@rajesh.com",
    "bio": "I like to code",
    "image": "https://i.stack.imgur.com/xHWG8.jpg"
  }
}
```

Authentication required, returns the [User](#users-for-authentication)

Accepted fields: `email`, `username`, `password`, `image`, `bio`

### Get Profile

`GET /profiles/:username`

Authentication optional, returns a [Profile](#profile)

### Follow user

`POST /profiles/:username/follow`

Authentication required, returns a [Profile](#profile)

No additional parameters required

### Unfollow user

`DELETE /profiles/:username/follow`

Authentication required, returns a [Profile](#profile)

No additional parameters required

### List Articles

`GET /articles`

Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=AngularJS`

Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`

Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`

Authentication optional, will return [multiple articles](#multiple-articles), ordered by most recent first

### Feed Articles

`GET /articles/feed`

Can also take `limit` and `offset` query parameters like [List Articles](#list-articles)

Authentication required, will return [multiple articles](#multiple-articles) created by followed users, ordered by most recent first.

### Get Article

`GET /articles/:slug`

No authentication required, will return [single article](#single-article)

### Create Article

`POST /articles`

Example request body:

```JSON
{
	"article": {
		"title": "Learn css",
		"description": "learn css",
		"body": "only css",
		"tagList": [
			"Html",
			"css",
			"ui",
			"front-end"
		]
	}
}
```

Authentication required, will return an [Article](#single-article)

Required fields: `title`, `description`, `body`

Optional fields: `tagList` as an array of Strings

### Update Article

`PUT /articles/:slug`

Example request body:

```JSON
{
  "article": {
    "title": "Learn html css"
  }
}
```

Authentication required, returns the updated [Article](#single-article)

Optional fields: `title`, `description`, `body`

The `slug` also gets updated when the `title` is changed

### Delete Article

`DELETE /articles/:slug`

Authentication required

### Add Comments to an Article

`POST /articles/:slug/comments`

Example request body:

```JSON
{
  "comment": {
    "body": "His name was my name too."
  }
}
```

Authentication required, returns the created [Comment](#single-comment)

Required field: `body`

### Get Comments from an Article

`GET /articles/:slug/comments`

Authentication optional, returns [multiple comments](#multiple-comments)

### Delete Comment

`DELETE /articles/:slug/comments/:id`

Authentication required

### Favorite Article

`POST /articles/:slug/favorite`

Authentication required, returns the [Article](#single-article)

No additional parameters required

### Unfavorite Article

`DELETE /articles/:slug/favorite`

Authentication required, returns the [Article](#single-article)

No additional parameters required

### Get Tags

`GET /tags`

No authentication required, returns a [List of Tags](#list-of-tags)
