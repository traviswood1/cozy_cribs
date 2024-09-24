'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    console.log('Starting up seeder');
    console.log('Options:', JSON.stringify(options));
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('SCHEMA:', process.env.SCHEMA);

    try {
      options.tableName = 'Users';  // Add this line to specify the table name
      await queryInterface.bulkInsert(options, [
        {
          email: 'demo@user.io',
          username: 'Demo-lition',
          hashedPassword: bcrypt.hashSync('password'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user1@user.io',
          username: 'FakeUser1',
          hashedPassword: bcrypt.hashSync('password2'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user2@user.io',
          username: 'FakeUser2',
          hashedPassword: bcrypt.hashSync('password3'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      console.log('Seeding completed successfully');
    } catch (error) {
      console.error('Error in seeder up:', error);
      throw error;  // Re-throw the error to stop the seeding process
    }
  },

  async down (queryInterface, Sequelize) {
    console.log('Starting down seeder');
    console.log('Options:', JSON.stringify(options));
    
    try {
      options.tableName = 'Users';
      await queryInterface.bulkDelete(options, null, {});
      console.log('Seeding reverted successfully');
    } catch (error) {
      console.error('Error in seeder down:', error);
      throw error;  // Re-throw the error to stop the seeding process
    }
  }
};