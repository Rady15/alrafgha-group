const express = require('express');
const offerController = require('../controllers/offerController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/active', offerController.getActiveOffers);

router.use(auth.protect, auth.restrictTo('admin'));

router.route('/')
    .get(offerController.getAllOffers)
    .post(offerController.createOffer);

router.route('/:id')
    .get(offerController.getOffer)
    .patch(offerController.updateOffer)
    .delete(offerController.deleteOffer);

router.patch('/:id/toggle', offerController.toggleOffer);

module.exports = router;
