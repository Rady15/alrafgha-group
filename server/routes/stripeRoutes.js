const express = require('express');
const stripeController = require('../controllers/stripeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Webhook route (must be raw body, no auth)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.handleWebhook);

// Public config
router.get('/config', stripeController.getStripeConfig);

// Protected routes
router.use(protect);

// Advance payment
router.post('/create-advance-intent', stripeController.createAdvancePaymentIntent);
router.post('/verify-and-book', stripeController.verifyAndCreateBooking);

// Final payment
router.post('/create-final-intent', stripeController.createFinalPaymentIntent);

module.exports = router;
