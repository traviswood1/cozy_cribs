'use strict';

const { Spot } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Cozy SF Apartment',
        description: 'A lovely apartment in the heart of San Francisco',
        price: 150.00
      },
      {
        ownerId: 2,
        address: '456 Park Ave',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Luxurious NYC Penthouse',
        description: 'Experience the height of luxury in this Manhattan penthouse',
        price: 500.00
      },
      {
        ownerId: 3,
        address: '789 Beach Rd',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        lat: 25.7617,
        lng: -80.1918,
        name: 'Beachfront Miami Villa',
        description: 'Relax in this stunning beachfront property in Miami',
        price: 300.00
      }
    ], { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Spots', null, {});
  }
};
