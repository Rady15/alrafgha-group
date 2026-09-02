const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
    .route('/')
    .get(restrictTo('admin', 'office_staff'), userController.getAllUsers)
    .post(restrictTo('admin'), userController.createUser);

router
    .route('/:id')
    .get(restrictTo('admin', 'office_staff'), userController.getUser)
    .patch(restrictTo('admin'), userController.updateUser)
    .delete(restrictTo('admin'), userController.deleteUser);

module.exports = router;
