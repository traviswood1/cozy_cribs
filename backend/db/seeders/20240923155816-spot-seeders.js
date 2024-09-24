'use strict';

const { User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';

    // First, let's get some valid user IDs
    const users = await User.findAll({ limit: 3 });
    if (users.length < 3) {
      console.error('Not enough users in the database. Please run the user seeder first.');
      return;
    }

    const spots = [
      {
        ownerId: users[0].id,
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Cozy Cottage',
        description: 'A charming cottage in the heart of the city.',
        price: 100.00,
      },
      {
        ownerId: users[1].id,
        address: '456 Elm St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Modern Apartment',
        description: 'A modern apartment with a view of the city skyline.',
        price: 150.00,
      },
      {
        ownerId: users[2].id,
        address: '789 Oak St',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Seaside Villa',
        description: 'A luxurious villa by the Pacific Ocean.',
        price: 200.00,
      },
    ];

    await queryInterface.bulkInsert(options.tableName, spots.map(spot => ({
      ...spot,
      createdAt: new Date(),
      updatedAt: new Date()
    })), {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options.tableName, {
      [Op.or]: [
        { address: '123 Main St' },
        { address: '456 Elm St' },
        { address: '789 Oak St' }
      ]
    }, {});
  }
};
