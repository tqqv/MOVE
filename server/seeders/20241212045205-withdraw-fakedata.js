'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const withdraws = [];


    const info = await queryInterface.sequelize.query(
      'SELECT * FROM withdrawInfors;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // console.log(info);


    for (let i = 0; i < 10; i++) {
      const infoNe = info.length > 0 ? info[Math.floor(Math.random() * info.length)] : null;

      const status = "completed";
      const stripePayoutId = `sp_${Math.random().toString(36).substring(2, 15)}`;

      const repValues = [100, 500, 10000, 5000, 25000, 0, 0, 0, 0];
      let rep = 0;

      for (let i = 0; i < 5; i++) {
        rep += repValues[Math.floor(Math.random() * repValues.length)];
      }

      const fromDate = new Date('2024-12-01');
      const toDate = new Date('2024-12-21');
      const createdAtDate = new Date(fromDate.getTime() + Math.random() * (toDate.getTime() - fromDate.getTime()));

      const amount = rep*0.015*0.5

      withdraws.push({
        id: uuidv4(),
        channelId: infoNe.channelId,
        amount: amount,
        status: status,
        arrivalDate: createdAtDate,
        updatedAt: new Date(),
        stripePayoutId: stripePayoutId,
        rep: rep,
        bankName: infoNe.bankName,
        bankHolderName: infoNe.bankHolderName,
        bankNumber: infoNe.bankNumber,
        createdAt: createdAtDate,
      });
    }

    await queryInterface.bulkInsert('withdraws', withdraws, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('withdraws', null, {});
  }
};
