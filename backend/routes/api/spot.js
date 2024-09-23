const express = require('express');
const { Spot } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');


// Get all spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll();
  res.json(spots);
});

//POST a new spot
router.post('/', requireAuth, async (req, res) => {
  const newSpot = await Spot.create({
    ...req.body,
    ownerId: req.user.id
  });
res.json(newSpot);
});

module.exports = router;