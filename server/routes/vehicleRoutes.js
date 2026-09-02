const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/grouped', vehicleController.getGroupedVehicles);
router.get('/featured', vehicleController.getFeaturedVehicles);
router.get('/vendor/:vendorId', vehicleController.getVehiclesByVendor);

// Protected routes
router.patch('/:id/toggle-feature', protect, restrictTo('admin'), vehicleController.toggleFeatureVehicle);

router
    .route('/')
    .get(vehicleController.getAllVehicles)
    .post(protect, restrictTo('admin', 'vendor'), vehicleController.createVehicle);

router
    .route('/:id')
    .get(vehicleController.getVehicle)
    .patch(protect, restrictTo('admin', 'vendor'), vehicleController.updateVehicle)
    .delete(protect, restrictTo('admin'), vehicleController.deleteVehicle);

module.exports = router;