'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('spotImages', [
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
  }
};

