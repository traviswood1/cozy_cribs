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
    if(review.userId !== req.user.id) {
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

// Validation middleware
const validateReview = [
  check('review')
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

//EDIT a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const { review: reviewText, stars } = req.body;

  const review = await Review.findByPk(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }
  if(review.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden", statusCode: 403 });
  }
  review.review = reviewText;
  review.stars = stars;
  await review.save();
  return res.json({ id: review.id, userId: review.userId, spotId: review.spotId, review: review.review, stars: review.stars, createdAt: review.createdAt, updatedAt: review.updatedAt });
});       

//DELETE a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findByPk(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  } 
  if(review.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden", statusCode: 403 });
  }
  await review.destroy(); 
  return res.status(200).json({ message: "Successfully deleted" });
}); 
  
  



module.exports = router;










