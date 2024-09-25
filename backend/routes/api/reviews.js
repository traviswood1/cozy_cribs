const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Review, ReviewImage, User, Spot } = require('../../db/models');


// GET all reviews of the current user
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;
  const reviews = await Review.findAll({
    where: { userId: user.id },
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      { model: ReviewImage, attributes: ['id', 'url'] },
      { model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 
        'country', 'lat', 'lng', 'name', 'price', 'previewImage'] }
    ],   
    attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt']
  });
  return res.json({ Reviews: reviews });
});

module.exports = router;










