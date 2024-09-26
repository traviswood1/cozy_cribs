const express = require('express');
const { Spot, Booking, User, Review, SpotImage, ReviewImage } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check, query, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const validateSpot = [
  check('address')
  .exists({ checkFalsy: true })
  .isLength({ min: 4 })
  .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required'),
  check('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({ min: 0.00 })
    .withMessage('Price must be a postive number'),
  handleValidationErrors
];

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

    if (overlappingBookings) {
      if (startDate >= overlappingBookings.startDate && startDate <= overlappingBookings.endDate) {
        throw new Error('Start date conflicts with an existing booking');
      }
      if (endDate >= overlappingBookings.startDate && endDate <= overlappingBookings.endDate) {
        throw new Error('End date conflicts with an existing booking');
      }
      throw new Error('Booking conflicts with an existing booking');
    }
    return true;
  }),
  handleValidationErrors
];

// Helper function to calculate average rating
const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, review) => acc + review.stars, 0);
  return (sum / reviews.length).toFixed(1);
};

//Create a booking from a spot based on the spot's id
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res) => {
  const { startDate, endDate } = req.body;
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId === req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const booking = await Booking.create({
    spotId: req.params.spotId,
    userId: req.user.id,
    startDate,
    endDate
  });

  const response = booking.toJSON();

  return res.status(201).json(response);
});

// Get all Bookings for a Spot based on the SpotId
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const isOwner = spot.ownerId === req.user.id;
  
  let bookings;
  if (isOwner) {
    bookings = await Booking.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
  } else {
    bookings = await Booking.findAll({
      where: { spotId },
      attributes: ['spotId', 'startDate', 'endDate']
    });
  }

  const formattedBookings = bookings.map(booking => {
    const bookingJSON = booking.toJSON();
    if (isOwner) {
      return {
        User: {
          id: bookingJSON.User.id,
          firstName: bookingJSON.User.firstName,
          lastName: bookingJSON.User.lastName
        },
        id: bookingJSON.id,
        spotId: bookingJSON.spotId,
        userId: bookingJSON.userId,
        startDate: bookingJSON.startDate,
        endDate: bookingJSON.endDate,
        createdAt: bookingJSON.createdAt,
        updatedAt: bookingJSON.updatedAt
      };
    } else {
      return {
        spotId: bookingJSON.spotId,
        startDate: bookingJSON.startDate,
        endDate: bookingJSON.endDate
      };
    }
  });

  res.json({ Bookings: formattedBookings });  
});
  
//POST a new spot image
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const newSpotImage = await SpotImage.create({
    spotId: req.params.spotId,
    url,
    preview,
  });

  // Convert to plain object and exclude specified properties
  const response = newSpotImage.toJSON();
  delete response.spotId;
  delete response.createdAt;
  delete response.updatedAt;

  return res.json(response);
});

// Validation middleware for query parameters
const validateQueryParams = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be greater than or equal to 1'),
  query('size').optional().isInt({ min: 1, max: 20 }).withMessage('Size must be between 1 and 20'),
  query('minLat').optional().isFloat({ min: -90, max: 90 }).withMessage('Minimum latitude is invalid'),
  query('maxLat').optional().isFloat({ min: -90, max: 90 }).withMessage('Maximum latitude is invalid'),
  query('minLng').optional().isFloat({ min: -180, max: 180 }).withMessage('Minimum longitude is invalid'),
  query('maxLng').optional().isFloat({ min: -180, max: 180 }).withMessage('Maximum longitude is invalid'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be greater than or equal to 0'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be greater than or equal to 0'),
];

// Get all spots
router.get('/', validateQueryParams, async (req, res) => {
  console.log('Query params:', req.query);  
  const errors = validationResult(req);
  console.log('Validation errors:', errors.array());  // Log any validation errors

  if (!errors.isEmpty()) {
    const errorObj = {};
    errors.array().forEach(error => {
      errorObj[error.path] = error.msg;
    });
    
    return res.status(400).json({
      message: "Bad Request",
      errors: errorObj
    });
  }

  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  // Pagination
  page = parseInt(page) || 1;
  size = parseInt(size) || 20;
  if (page < 1) page = 1;
  if (size < 1) size = 1;
  if (size > 20) size = 20;
  const offset = (page - 1) * size;

  // Filtering
  const where = {};
  if (minLat !== undefined) where.lat = { ...where.lat, [Op.gte]: parseFloat(minLat) };
  if (maxLat !== undefined) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
  if (minLng !== undefined) where.lng = { ...where.lng, [Op.gte]: parseFloat(minLng) };
  if (maxLng !== undefined) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
  if (minPrice !== undefined) where.price = { ...where.price, [Op.gte]: parseFloat(minPrice) };
  if (maxPrice !== undefined) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

  try {
    const spots = await Spot.findAll({
      where,
      include: [{
        model: Review,
        attributes: ['stars']
      },
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false,
        limit: 1
      }],
      limit: size,
      offset: offset
    });

    const spotsWithRatings = spots.map(spot => {
      const plainSpot = spot.get({ plain: true });
      const { Reviews, SpotImages, lat, lng, price, ...spotWithoutReviews } = plainSpot;
      
      return {
        id: spotWithoutReviews.id,
        ownerId: spotWithoutReviews.ownerId,
        address: spotWithoutReviews.address,
        city: spotWithoutReviews.city,
        state: spotWithoutReviews.state,
        country: spotWithoutReviews.country,
        lat: Number(spotWithoutReviews.lat),
        lng: Number(spotWithoutReviews.lng),
        name: spotWithoutReviews.name,
        description: spotWithoutReviews.description,
        price: Number(spotWithoutReviews.price),
        createdAt: spotWithoutReviews.createdAt,
        updatedAt: spotWithoutReviews.updatedAt,
        avgRating: parseFloat(calculateAverageRating(Reviews)),
        previewImage: spot.SpotImages[0]?.url || null
      };
    });

    res.json({
      Spots: spotsWithRatings,
      page,
      size
    });
  } catch (error) {
    console.error('Error fetching spots:', error);
    res.status(500).json({ message: "An error occurred while fetching spots" });
  }
});

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
  const spotId = req.params.spotId;
  console.log(`Starting PUT request for spot ${spotId}`);

  try {
    console.log(`Attempting to find spot with id: ${spotId}`);
    const spot = await Spot.findByPk(spotId);
    
    if (!spot) {
      console.log(`Spot with id ${spotId} not found`);
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    console.log(`Spot found:`, spot.toJSON());

    console.log(`Checking ownership for user ${req.user.id}`);
    if (spot.ownerId !== req.user.id) {
      console.log(`Ownership check failed`);
      return res.status(403).json({ message: "Forbidden" });
    }

    console.log(`Updating spot data`);
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    
    await spot.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    console.log(`Spot updated, fetching latest data`);
    const updatedSpot = await Spot.findByPk(spotId);

    console.log(`Sending response`);
    res.json(updatedSpot);

  } catch (error) {
    console.error(`Error in PUT /spots/${spotId}:`, error);
    next(error);
  }

  console.log(`PUT request for spot ${spotId} completed`);
});

//GET all spots by current user
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const spots = await Spot.findAll({
    where: { ownerId: userId },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Review,
        attributes: ['stars']
      },
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false,
        limit: 1
      }
    ]
  });

  const formattedSpots = spots.map(spot => {
    const plainSpot = spot.get({ plain: true });
    const { User, Reviews, SpotImages, ...spotData } = plainSpot;

    return {
      id: spotData.id,
      ownerId: spotData.ownerId,
      address: spotData.address,
      city: spotData.city,
      state: spotData.state,
      country: spotData.country,
      lat: spotData.lat,
      lng: spotData.lng,
      name: spotData.name,
      description: spotData.description,
      price: spotData.price,
      createdAt: spotData.createdAt,
      updatedAt: spotData.updatedAt,
      avgRating: parseFloat(calculateAverageRating(Reviews)),
      previewImage: spotData.previewImage
    };
  });

  res.json({ Spots: formattedSpots });
});

//GET details of a Spot from spotId
router.get('/:spotId', async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId, {
      include: [
        {
          model: Review,
          attributes: ['stars']
        },
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview'],
          where: { preview: true },
          required: false
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const plainSpot = spot.get({ plain: true });
    const { Reviews, ...spotData } = plainSpot;

    const formattedSpot = {
      id: spotData.id,
      ownerId: spotData.ownerId,
      address: spotData.address,
      city: spotData.city,
      state: spotData.state,
      country: spotData.country,
      lat: spotData.lat,
      lng: spotData.lng,
      name: spotData.name,
      description: spotData.description,
      price: spotData.price,
      createdAt: spotData.createdAt,
      updatedAt: spotData.updatedAt,
      numReviews: Reviews.length,
      avgStarRating: calculateAverageRating(Reviews),
      SpotImages: spotData.SpotImages,
      Owner: spotData.User,
    };

    res.json(formattedSpot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching the spot" });
  }
});

//POST a new spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  });
  return res.status(201).json(newSpot);
});

//Delete a spot 
router.delete('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  } 
  await spot.destroy();
  return res.json({ message: "Successfully deleted" });
});

// Validation middleware
const validateReview = [
  check('review')
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
];

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
  const spotId = req.params.spotId;
  
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    });
  }
  
  const reviews = await Review.findAll({
    where: { spotId },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'] 
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  }); 

  const formattedReviews = reviews.map(review => {
    const reviewJSON = review.toJSON();
    return {
      id: reviewJSON.id,
      userId: reviewJSON.userId,
      spotId: reviewJSON.spotId,
      review: reviewJSON.review,
      stars: reviewJSON.stars,
      createdAt: reviewJSON.createdAt,
      updatedAt: reviewJSON.updatedAt,
      User: {
        id: reviewJSON.User.id,
        firstName: reviewJSON.User.firstName,
        lastName: reviewJSON.User.lastName
      },
      ReviewImages: reviewJSON.ReviewImages ? reviewJSON.ReviewImages.map(image => ({
        id: image.id,
        url: image.url
      })) : []
    };
  });
 res.json({ Reviews: formattedReviews });
});

// CREATE a review for a spot based on the spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorObj = {};
    errors.array().forEach(error => {
      errorObj[error.path] = error.msg;
    });
    
    return res.status(400).json({
      message: "Bad Request",
      errors: errorObj
    });
  }

  const { user } = req;
  const { spotId } = req.params;
  const { review, stars } = req.body;

  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user already has a review for this spot
    const existingReview = await Review.findOne({
      where: { userId: user.id, spotId }
    });
    if (existingReview) {
      return res.status(500).json({ message: "User already has a review for this spot" });
    }

    const newReview = await Review.create({ 
      userId: user.id, 
      spotId, 
      review, 
      stars, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    });

    return res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while creating the review" });
  }
});

module.exports = router;