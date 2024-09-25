const express = require('express');
const { Spot } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
const { Review, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Helper function to calculate average rating
const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, review) => acc + review.stars, 0);
  return (sum / reviews.length).toFixed(1);
};

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

// Get all spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll({
    include: [{
      model: Review,
      attributes:['stars']
    },
    {
      model: SpotImage,
      attributes: ['url'],
      where: { preview: true },
      required: false,
      limit: 1
    }
  ],
});

  const spotsWithRatings = spots.map(spot => {
    const plainSpot = spot.get({ plain: true });
    const { Reviews, SpotImages, ...spotWithoutReviews } = plainSpot;
    return {
      ...spotWithoutReviews,
      avgStarRating: calculateAverageRating(Reviews),
      previewImage: spot.SpotImages[0].url  
    };
  });

  res.json(spotsWithRatings);
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
    include:      
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    
  });

  const formattedSpots = spots.map(spot => {
    const plainSpot = spot.get({ plain: true });
    const { User, ...spotData } = plainSpot;

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
      updatedAt: spotData.updatedAt
    };
  });

  res.json({ Spots: formattedSpots });
});

//GET details of a Spot from an id
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
  return res.json(newSpot);
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