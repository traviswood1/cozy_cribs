'use strict';

const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await User.bulkCreate([
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe123',
        email: 'john.doe@example.com',
        password: 'hashedpassword1'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith456',
        email: 'jane.smith@example.com',
        password: 'hashedpassword2'
      },
      {
        firstName: 'Alex',
        lastName: 'Johnson',
        username: 'alexj789',
        email: 'alex.johnson@example.com',
        password: 'hashedpassword3'
      }
    ], { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
