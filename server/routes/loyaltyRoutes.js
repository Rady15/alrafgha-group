const express = require('express');
const loyaltyController = require('../controllers/loyaltyController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth.protect);

router.get('/my-points', loyaltyController.getMyPoints);
router.get('/my-tier', loyaltyController.getMyTier);
router.get('/referral-code', loyaltyController.getReferralCode);
router.post('/redeem', loyaltyController.redeemPoints);

router.get('/admin/users', auth.restrictTo('admin'), loyaltyController.getAllUsersLoyalty);
router.get('/admin/tiers', auth.restrictTo('admin'), loyaltyController.getTiers);
router.post('/admin/tiers', auth.restrictTo('admin'), loyaltyController.createTier);
router.patch('/admin/tiers/:id', auth.restrictTo('admin'), loyaltyController.updateTier);
router.post('/admin/adjust-points', auth.restrictTo('admin'), loyaltyController.adjustPoints);

module.exports = router;
