'use strict';

const { Review } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: 'Great location and cozy apartment. Loved my stay!',
        stars: 5
      },
      {
        spotId: 1,
        userId: 3,
        review: 'Clean and comfortable, but a bit noisy at night.',
        stars: 4
      },
      {
        spotId: 2,
        userId: 1,
        review: 'Absolutely stunning penthouse with breathtaking views!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Luxurious stay, but had some issues with the air conditioning.',
        stars: 4
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Beautiful beachfront property, perfect for a relaxing vacation.',
        stars: 5
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Gorgeous villa, but the beach was a bit crowded during our stay.',
        stars: 4
      }
    ], { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
