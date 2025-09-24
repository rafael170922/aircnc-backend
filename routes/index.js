const express = require('express');
const SessionRoutes = require('./Session.routes');
const SpotsRoutes = require('./Spots.routes');
const dashboardRoutes = require('./Dashboard.routes');
const BookingRoutes = require('./Booking.routes')

const router = express.Router();

router.use('/session', SessionRoutes);
router.use('/spots', SpotsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/bookings', BookingRoutes)

module.exports = router;




