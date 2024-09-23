const express = require('express');
const { Spot } = require('../../db/models');
const router = express.Router();

// Get all spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll();
  res.json(spots);
});

module.exports = router;