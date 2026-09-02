const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(protect, restrictTo('admin'), paymentController.getAllPayments)
    .post(protect, restrictTo('admin'), paymentController.createPayment);

router
    .route('/:id')
    .get(protect, restrictTo('admin'), paymentController.getPayment)
    .patch(protect, restrictTo('admin'), paymentController.updatePayment)
    .delete(protect, restrictTo('admin'), paymentController.deletePayment);

module.exports = router;
