const BlogPost = require('../models/BlogPost');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sanitizeHtml = require('sanitize-html');

const sanitizeContent = (content) => {
    return sanitizeHtml(content, {
        allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'a', 'img', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'td', 'th'],
        allowedAttributes: {
            'a': ['href', 'target', 'rel'],
            'img': ['src', 'alt', 'width', 'height'],
            'span': ['style'],
            'div': ['style'],
            'p': ['style'],
            'td': ['colspan', 'rowspan'],
            'th': ['colspan', 'rowspan']
        },
        allowedSchemes: ['http', 'https', 'mailto']
    });
};

exports.getPublishedPosts = catchAsync(async (req, res, next) => {
    const posts = await BlogPost.find({ is_published: true })
        .sort('-published_at')
        .populate('author', 'name');
    res.status(200).json({ status: 'success', results: posts.length, data: { posts } });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
    const posts = await BlogPost.find().sort('-created_at').populate('author', 'name');
    res.status(200).json({ status: 'success', results: posts.length, data: { posts } });
});

exports.getPost = catchAsync(async (req, res, next) => {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name');
    if (!post) return next(new AppError('Post not found', 404));
    res.status(200).json({ status: 'success', data: { post } });
});

exports.getPostBySlug = catchAsync(async (req, res, next) => {
    const post = await BlogPost.findOne({ slug: req.params.slug, is_published: true }).populate('author', 'name');
    if (!post) return next(new AppError('Post not found', 404));
    post.views += 1;
    await post.save({ validateBeforeSave: false });
    res.status(200).json({ status: 'success', data: { post } });
});

exports.createPost = catchAsync(async (req, res, next) => {
    try {
        req.body.author = req.user.id;
        if (req.body.is_published && !req.body.published_at) req.body.published_at = new Date();
        // XSS FIX: Sanitize HTML content
        if (req.body.content) req.body.content = sanitizeContent(req.body.content);
        if (req.body.title) req.body.title = sanitizeHtml(req.body.title, { allowedTags: [], allowedAttributes: {} });
        if (req.body.excerpt) req.body.excerpt = sanitizeHtml(req.body.excerpt, { allowedTags: [], allowedAttributes: {} });
        const post = await BlogPost.create(req.body);
        res.status(201).json({ status: 'success', data: { post } });
    } catch (error) {
        if (error.code === 11000) {
            return next(new AppError('A post with this slug already exists', 400));
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return next(new AppError(`Validation failed: ${messages.join(', ')}`, 400));
        }
        throw error;
    }
});

exports.updatePost = catchAsync(async (req, res, next) => {
    if (req.body.is_published && !req.body.published_at) req.body.published_at = new Date();
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return next(new AppError('Post not found', 404));
    res.status(200).json({ status: 'success', data: { post } });
});

exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return next(new AppError('Post not found', 404));
    res.status(200).json({ status: 'success', message: 'Post deleted' });
});

exports.togglePublish = catchAsync(async (req, res, next) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return next(new AppError('Post not found', 404));
    post.is_published = !post.is_published;
    if (post.is_published) post.published_at = new Date();
    await post.save();
    res.status(200).json({ status: 'success', data: { post } });
});
