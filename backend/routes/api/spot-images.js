const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

//Delete a spot-image
router.delete('/:imageId', requireAuth, async (req, res) => {
    console.log(`Attempting to delete image with id: ${req.params.imageId}`);
    console.log(`Current user id: ${req.user.id}`);

    const image = await SpotImage.findByPk(req.params.imageId);

    if (!image) {
        console.log(`Image with id ${req.params.imageId} not found`);
        return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    console.log(`Image found: ${JSON.stringify(image)}`);

    // Fetches the spot associated with the image
    const spot = await Spot.findByPk(image.spotId);
    
    if (!spot) {
        console.log(`Spot with id ${image.spotId} not found`);
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    console.log(`Spot found: ${JSON.stringify(spot)}`);
    console.log(`Spot owner id: ${spot.ownerId}`);

    // Check if the current user is the owner of the spot
    if (spot.ownerId !== req.user.id) {
        console.log(`User ${req.user.id} is not the owner of spot ${spot.id}`);
        return res.status(403).json({ message: "Forbidden" });
    }

    console.log(`User ${req.user.id} is the owner of spot ${spot.id}. Proceeding with deletion.`);
  
    await image.destroy();
  
    console.log(`Image ${req.params.imageId} successfully deleted`);
    return res.json({ message: "Successfully deleted" });
});

module.exports = router;