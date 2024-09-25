const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
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

// POST an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { url } = req.body;

    // Find the review
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check if the current user is the owner of the review
    if(review.userId !== user.id) {
      return res.status(403).json({ message: "Forbidden", statusCode: 403 });
    }

    // Counts images for current review
    const imageCount = await ReviewImage.count({ where: { reviewId } });

    // max image count check
    if (imageCount >= 10) {
      return res.status(403).json({ 
        message: "Maximum number of images for this resource was reached",
        statusCode: 403
      });
    }

    // Create the new image
    const image = await ReviewImage.create({ url, reviewId });

    // Return only id and url in the response
    return res.status(201).json({ 
      id: image.id,
      url: image.url
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while adding the image to the review" });
  }
});

module.exports = router;










