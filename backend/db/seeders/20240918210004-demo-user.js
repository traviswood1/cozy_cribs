'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    console.log('Starting up migration');
    console.log('Options:', JSON.stringify(options));
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('SCHEMA:', process.env.SCHEMA);

    try {
      await queryInterface.bulkInsert(options, [
        {
          email: 'demo@user.io',
          username: 'Demo-lition',
          firstName: 'Demo',
          lastName: 'User',
          hashedPassword: bcrypt.hashSync('password')
        },
        {
          email: 'user1@user.io',
          username: 'FakeUser1',
          firstName: 'Fake',
          lastName: 'User1',
          hashedPassword: bcrypt.hashSync('password2')
        },
        {
          email: 'user2@user.io',
          username: 'FakeUser2',
          firstName: 'Fake',
          lastName: 'User2',
          hashedPassword: bcrypt.hashSync('password3')
        }
      ]);
      console.log('Table created successfully');
    } catch (error) {
      console.error('Error in migration up:', error);
      throw error;  // Re-throw the error to stop the migration process
    }
  },

  async down (queryInterface, Sequelize) {
    console.log('Starting down migration');
    console.log('Options:', JSON.stringify(options));
    
    try {
      options.tableName = 'Users';
      await queryInterface.bulkDelete(options, null, {});
      console.log('Table dropped successfully');
    } catch (error) {
      console.error('Error in migration down:', error);
      throw error;  // Re-throw the error to stop the migration process
    }
  }
};