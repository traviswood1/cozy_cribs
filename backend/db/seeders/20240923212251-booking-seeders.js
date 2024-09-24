'use strict';
const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-05'),
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2024-07-02'),
        endDate: new Date('2024-07-06'),
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2024-07-03'),
        endDate: new Date('2024-07-07'),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
		options.tableName = "Bookings";
		return queryInterface.bulkDelete(options, null, {});
	},
};
