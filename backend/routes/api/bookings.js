const express = require('express');
const router = express.Router();
const { Booking, Spot, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

const validateBooking = [
    check('bookingId')
      .exists({ checkFalsy: true })
      .withMessage('Booking couldn\'t be found')
      .custom(async (value, { req }) => {
        const booking = await Booking.findByPk(value);
        if (!booking) {
          throw new Error('Booking couldn\'t be found');
        }
        req.booking = booking; // Store the booking for later use
        return true;
      }),
    check('startDate')
      .exists({ checkFalsy: true })
      .withMessage('Start date is required')
      .isDate()
      .withMessage('Start date must be a valid date')
      .custom(async (value, { req }) => {
        const startDate = new Date(value);
        const endDate = new Date(req.body.endDate);
        const spotId = req.booking.spotId; // Use the spotId from the found booking

        const overlappingBookings = await Booking.findOne({
          where: {
            spotId,
            id: { [Op.ne]: req.params.bookingId }, // Exclude the current booking
            [Op.or]: [
              { startDate: { [Op.between]: [startDate, endDate] } },
              { endDate: { [Op.between]: [startDate, endDate] } },
              { 
                [Op.and]: [
                  { startDate: { [Op.lte]: startDate } },
                  { endDate: { [Op.gte]: endDate } }
                ]
              }
            ]
          }
        });

        if (overlappingBookings) {
          throw new Error('Sorry, this spot is already booked for the specified dates');
        }
        return true;
      }),
    check('endDate')
      .exists({ checkFalsy: true })
      .withMessage('End date is required')
      .isDate()
      .withMessage('End date must be a valid date'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorObj = {
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {}
        };
        errors.array().forEach(error => {
          errorObj.errors[error.param] = error.msg;
        });
        return res.status(403).json(errorObj);
      }
      next();
    }
];

// Get all of the Current User's Bookings
router.get('/current', async (req, res) => {
  const { user } = req;
  const bookings = await Booking.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'previewImage']
      }
    ],
    attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
  });

  const formattedBookings = bookings.map(booking => ({
    id: booking.id,
    spotId: booking.spotId,
    Spot: {
      ...booking.Spot.toJSON(),
      previewImage: booking.Spot.previewImage || null
    },
    userId: booking.userId,
    startDate: booking.startDate.toISOString().split('T')[0],
    endDate: booking.endDate.toISOString().split('T')[0],
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString()
}));

  res.json({ Bookings: formattedBookings });
});

// Edit a Booking based on the Booking's id
router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
  const { user } = req;
  const { startDate, endDate } = req.body;
  const booking = req.booking; // Use the booking stored during validation

  if (booking.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const currentDate = new Date();
  const bookingEndDate = new Date(booking.endDate);
  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  if (bookingEndDate < currentDate) {
    return res.status(403).json({ message: "Past bookings can't be modified" });
  }

  try {
    const updatedBooking = await booking.update({
      startDate: newStartDate,
      endDate: newEndDate
    });
    res.json({
      id: updatedBooking.id,
      spotId: updatedBooking.spotId,
      userId: updatedBooking.userId,
      startDate: updatedBooking.startDate.toISOString().split('T')[0],
      endDate: updatedBooking.endDate.toISOString().split('T')[0],
      createdAt: updatedBooking.createdAt.toISOString(),
      updatedAt: updatedBooking.updatedAt.toISOString()
    });
  } catch (error) {
    res.status(400).json({ message: "Bad Request", errors: error.errors });
  }
});

// Delete a Booking based on the Booking's id
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const { user } = req;
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }
  if (booking.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Check if the booking's start date is in the past
  const currentDate = new Date();
  const bookingStartDate = new Date(booking.startDate);
  if (bookingStartDate < currentDate) {
    return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
  }

  await booking.destroy();
  res.status(200).json({ message: 'Successfully deleted' });
});

module.exports = router;