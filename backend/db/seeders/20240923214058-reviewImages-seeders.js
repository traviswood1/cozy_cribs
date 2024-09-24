'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
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
		options.tableName = "ReviewImages";
		return queryInterface.bulkDelete(options, null, {});
	},
};
