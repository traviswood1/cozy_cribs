'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
        preview: true,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('spotImages', null, {});
		options.tableName = "SpotImages";
		return queryInterface.bulkDelete(options, null, {});
	},
};
