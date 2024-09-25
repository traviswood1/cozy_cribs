const express = require('express');
const router = express.Router();
const { Booking, Spot, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const validateBooking = [
    check('spotId')
      .exists({ checkFalsy: true })
      .withMessage('Spot couldn\'t be found'),
    check('startDate')
      .exists({ checkFalsy: true })
      .withMessage('Start date is required')
      .isDate()
      .withMessage('Start date must be a valid date')
      .custom((value, { req }) => {
        const startDate = new Date(value);
        const currentDate = new Date();
        if (startDate < currentDate) {
          throw new Error('startDate cannot be in the past');
        }
        return true;
      }),
    check('endDate')
      .exists({ checkFalsy: true })
      .withMessage('End date is required')
      .isDate()
      .withMessage('End date must be a valid date')
      .custom((value, { req }) => {
        const endDate = new Date(value);
        const startDate = new Date(req.body.startDate);
        if (endDate <= startDate) {
          throw new Error('endDate cannot be on or before startDate');
        } 
        return true;
      }),
    check('startDate').custom(async (value, { req }) => {
      const startDate = new Date(value);
      const endDate = new Date(req.body.endDate);
      const spotId = req.params.spotId;
  
      const overlappingBookings = await Booking.findOne({
        where: {
          spotId,
          [Op.or]: [
            { startDate: { [Op.between]: [startDate, endDate] } },
            { endDate: { [Op.between]: [startDate, endDate] } },
            { [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } }
            ]}
          ]
        }
      });
    }),
    handleValidationErrors
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
router.put('/:bookingId', async (req, res) => {
  const { user } = req;
  const { spotId, startDate, endDate } = req.body;
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.status = 404;
    throw err;
  }
  if (booking.userId !== user.id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  if (startDate >= endDate) {
    const err = new Error('Bad Request');
    err.status = 400;
    throw err;
  }
  const updatedBooking = await booking.update({
    startDate,
    endDate
  });
  res.json({ Booking: updatedBooking });
});

// Delete a Booking based on the Booking's id
router.delete('/:bookingId', async (req, res) => {
  const { user } = req;
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.status = 404;
    throw err;
  }
  if (booking.userId !== user.id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  await booking.destroy();
  res.status(204).json({ message: 'Successfully deleted' });
});

module.exports = router;