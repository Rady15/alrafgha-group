const express = require('express');
const couponController = require('../controllers/couponController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/validate', couponController.validateCoupon);

router.use(auth.protect, auth.restrictTo('admin'));

router.route('/')
    .get(couponController.getAllCoupons)
    .post(couponController.createCoupon);

router.route('/:id')
    .get(couponController.getCoupon)
    .patch(couponController.updateCoupon)
    .delete(couponController.deleteCoupon);

module.exports = router;
