const express = require('express');
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', blogController.getAllPosts);
router.get('/published', blogController.getPublishedPosts);
router.get('/slug/:slug', blogController.getPostBySlug);

router.use(auth.protect, auth.restrictTo('admin'));

router.route('/')
    .post(blogController.createPost);

router.route('/:id')
    .get(blogController.getPost)
    .patch(blogController.updatePost)
    .delete(blogController.deletePost);

router.patch('/:id/publish', blogController.togglePublish);

module.exports = router;
