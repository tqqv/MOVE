"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("videos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false, // Đã định nghĩa là NOT NULL
        references: {
          model: 'users', // Tên bảng trong cơ sở dữ liệu
          key: 'id',      // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Xóa video khi người dùng bị xóa
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories', // Tên bảng trong cơ sở dữ liệu
          key: 'id',          // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Đặt categoryId thành NULL nếu category bị xóa
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      videoUrl: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      thumbnailUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      isCommentable: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      viewCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      levelWorkoutsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'levelWorkouts', // Tên bảng trong cơ sở dữ liệu
          key: 'id',            // Tên cột bạn muốn tham chiếu đến
        },
        onDelete: 'CASCADE', // Xóa video khi levelWorkout bị xóa
      },
      status: {
        type: Sequelize.ENUM('public', 'private', 'restricted'),
        allowNull: false,
        defaultValue: 'public',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("videos");
  },
};
