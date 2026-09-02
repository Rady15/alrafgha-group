const express = require('express');
const packageController = require('../controllers/packageController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(packageController.getAllPackages)
    .post(protect, restrictTo('admin'), packageController.createPackage);

router.get('/for-vehicle', packageController.getPackageForVehicle);

router
    .route('/:id')
    .get(packageController.getPackageById)
    .patch(protect, restrictTo('admin'), packageController.updatePackage)
    .delete(protect, restrictTo('admin'), packageController.deletePackage);

module.exports = router;
