'use strict';

const { Booking } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Booking.bulkCreate([
      {
        userId: 1,
        spotId: 2,
        startDate: new Date('2023-07-01'),
        endDate: new Date('2023-07-07')
      },
      {
        userId: 2,
        spotId: 1,
        startDate: new Date('2023-08-15'),
        endDate: new Date('2023-08-20')
      },
      {
        userId: 3,
        spotId: 3,
        startDate: new Date('2023-09-10'),
        endDate: new Date('2023-09-17')
      },
      {
        userId: 1,
        spotId: 3,
        startDate: new Date('2023-10-05'),
        endDate: new Date('2023-10-10')
      },
      {
        userId: 2,
        spotId: 2,
        startDate: new Date('2023-11-20'),
        endDate: new Date('2023-11-25')
      }
    ], { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bookings', null, {});
  }
};
