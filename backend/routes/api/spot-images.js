const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

//Delete a spot-image
router.delete('/:imageId', requireAuth, async (req, res) => {

    const image = await SpotImage.findByPk(req.params.imageId);

    if (!image) {
        console.log(`Image with id ${req.params.imageId} not found`);
        return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    // Fetches the spot associated with the image
    const spot = await Spot.findByPk(image.spotId);
    
    if (!spot) {
        console.log(`Spot with id ${image.spotId} not found`);
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the current user is the owner of the spot
    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }
  
    await image.destroy();
  
    return res.json({ message: "Successfully deleted" });
});

module.exports = router;