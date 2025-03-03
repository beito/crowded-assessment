'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('services', [
      {
        name: 'Electricity Bill',
        price: 50.0,
      },
      {
        name: 'Water Bill',
        price: 30.0,
      },
      {
        name: 'Internet Bill',
        price: 25.0,
      },
      {
        name: 'Gas Bill',
        price: 20.0,
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('services', null, {});
  }
};
