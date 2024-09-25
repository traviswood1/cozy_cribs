const express = require('express');
const { ReviewImage } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

//Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const image = await ReviewImage.findByPk(req.params.imageId);
    if (!image) {
        return res.status(404).json({ message: "Review Image couldn't be found" });
    }
    await image.destroy();
    return res.json({ message: "Successfully deleted" });   
});

module.exports = router;