'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const viewVideos = [];
    const cities = ['Da Nang', 'Quang Nam', 'TP HCM', 'Ha Noi', 'Hai Phong', 'Can Tho'];

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userIds = users.map(user => user.id);

    const videos = await queryInterface.sequelize.query(
      'SELECT id FROM videos;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const videoIds = videos.map(video => video.id);
    // Tạo dữ liệu giả
    for (let i = 0; i < 500; i++) {
      viewVideos.push({
        id: uuidv4(),
        viewerId: userIds[Math.floor(Math.random() * userIds.length)],
        videoId: videoIds[Math.floor(Math.random() * videoIds.length)],
        createdAt: faker.date.recent(90), // Trong 90 ngày gần đây
        updatedAt: new Date(),
        viewTime: faker.number.int({ min: 1, max: 15 }), // Giây: 10 giây đến 2 giờ
        ip: faker.internet.ip(),
        country: "Viet Nam",
        city: cities[Math.floor(Math.random() * cities.length)],
        livestreamId:  null, // 50% livestreamId là null
      });
    }

    // Chèn dữ liệu vào bảng `viewVideos`
    await queryInterface.bulkInsert('viewVideos', viewVideos, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('viewVideos', null, {});
  }
};
