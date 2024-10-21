'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột nhưng cho phép null để không vi phạm dữ liệu hiện tại
    await queryInterface.addColumn('ratings', 'livestreamId', {
      type: Sequelize.UUID,
      allowNull: true,  // Cho phép null tạm thời
    });

    // Bạn có thể thêm giá trị mặc định cho livestreamId cho các hàng hiện tại
    // await queryInterface.sequelize.query(`
    //   UPDATE ratings SET livestreamId = 'một giá trị UUID hợp lệ từ bảng livestreams'
    // `);

    // Sau khi cập nhật dữ liệu, bạn có thể đổi allowNull thành false và thêm khóa ngoại
    await queryInterface.changeColumn('ratings', 'livestreamId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'livestreams',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ratings', 'livestreamId');
  }
};
