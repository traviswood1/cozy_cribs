'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: 'Great spot!',
        stars: 5,
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Good spot!',
        stars: 4,
      },
      {
        userId: 3,
				spotId: 3,
				review: "Mediocre spot!",
				stars: 3,
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "Reviews";
		return queryInterface.bulkDelete(options, null, {});
	},
};
