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
    .isDecimal({ min: 0, decimal_digits: '0,2' })
    .withMessage('Price must be a postive number'),
  handleValidationErrors
];
const { Review, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');

// Helper function to calculate average rating
const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, review) => acc + review.stars, 0);
  return (sum / reviews.length).toFixed(1);
};



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
  // group: ['Spot.id']
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

//GET details of a Spot from an id
router.get('/spotId', async (req, res) => {
  try {
    // const spotId = req.params.spotId;
     await Spot.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          attributes: ['stars']
        },
        {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true },
          required: false
        }
      ]
    });

    const plainSpot = spot.get({ plain: true });
    const { Reviews, SpotImages, ...spotData } = plainSpot;

    const formattedSpot = {
      ...spotData,
      avgStarRating: calculateAverageRating(Reviews),
      previewImage: SpotImages && SpotImages.length > 0 ? SpotImages[0].url : null
    };

    res.json(formattedSpot);
  } catch (error) {
    console.error('Error in getSpotById:', error);
    res.status(500).json({ message: 'An error occurred while fetching the spot.' });
  }
});

//POST a new spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const newSpot = await Spot.create({
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

module.exports = router;