const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

//Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const image = await ReviewImage.findByPk(req.params.imageId);
    if (!image) {
        return res.status(404).json({ message: "Review Image couldn't be found" });
    }
    const review = await Review.findByPk(image.reviewId);
    if (review.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden", statusCode: 403 });
    }
    await image.destroy();
    return res.json({ message: "Successfully deleted" });   
});

module.exports = router;