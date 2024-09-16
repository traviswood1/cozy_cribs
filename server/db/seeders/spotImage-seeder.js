'use strict';

const { SpotImage } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://example.com/sf-apartment-1.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://example.com/sf-apartment-2.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://example.com/nyc-penthouse-1.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://example.com/nyc-penthouse-2.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://example.com/miami-villa-1.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://example.com/miami-villa-2.jpg',
        preview: false
      }
    ], { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('SpotImages', null, {});
  }
};
