'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('reviewImages', [
      {
        reviewId: 1,
        url: 'https://example.com/review1.jpg',
      },
      {
        reviewId: 2,
        url: 'https://example.com/review2.jpg',
      },
      {
        reviewId: 3,
        url: 'https://example.com/review3.jpg',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reviewImages', null, {});
  }
};
