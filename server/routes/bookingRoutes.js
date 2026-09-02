const express = require('express');
const bookingController = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Customer routes
router.post('/request', protect, restrictTo('user'), bookingController.createBookingRequest);
router.get('/user/:userId', protect, bookingController.getUserBookings);

// Office staff routes (admin can also access)
router.get('/office-staff/requests', protect, restrictTo('admin', 'office_staff'), bookingController.getOfficeStaffRequests);
router.patch('/:bookingId/pickup', protect, restrictTo('admin', 'office_staff'), bookingController.confirmPickup);
router.patch('/:bookingId/return', protect, restrictTo('admin', 'office_staff'), bookingController.confirmReturn);
router.patch('/:bookingId/reject', protect, restrictTo('admin', 'office_staff'), bookingController.rejectBooking);
router.patch('/:bookingId/mark-refund-returned', protect, restrictTo('admin', 'office_staff'), bookingController.markRefundReturned);

// General routes
router
    .route('/')
    .get(protect, restrictTo('admin'), bookingController.getAllBookings);

router
    .route('/:id')
    .get(protect, bookingController.getBooking)
    .delete(protect, bookingController.cancelBooking);

module.exports = router;
