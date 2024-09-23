'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('reviews', [
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
        review: 'Mediocre spot!',
        stars: 3,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reviews', null, {});
  }
};
