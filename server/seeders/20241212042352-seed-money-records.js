'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const payments = [];
    const paymentStatuses = ['completed'];

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userIds = users.map(user => user.id);

    const repPackages = await queryInterface.sequelize.query(
      'SELECT id, rep, amount FROM repPackages;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (let i = 0; i < 1000; i++) {
      const selectedPackage = repPackages.length > 0 ? repPackages[Math.floor(Math.random() * repPackages.length)] : null;

      const fromDate = new Date('2023-01-01');
      const toDate = new Date('2024-12-31');
      const createdAtDate = new Date(fromDate.getTime() + Math.random() * (toDate.getTime() - fromDate.getTime()));

      payments.push({
        id: uuidv4(),
        userId: userIds[Math.floor(Math.random() * userIds.length)],
        amount: selectedPackage ? selectedPackage.amount : 0,
        rep: selectedPackage ? selectedPackage.rep : 0,
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        createdAt: createdAtDate,
        updatedAt: new Date(),
        paymentIntentId: `pi_${Math.random().toString(36).substring(2, 15)}`,
        paymentMethodId: `pm_${Math.random().toString(36).substring(2, 15)}`,
        repPackageId: selectedPackage ? selectedPackage.id : null,
      });
    }

    await queryInterface.bulkInsert('payments', payments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payments', null, {});
  }
};
