'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo bảng Reports
    await queryInterface.createTable('Reports', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      reporterId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetCommentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetVideoId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'videos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetLivestreamId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'livestreams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetAccountId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      targetChannelId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'channels',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reportTypeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'ReportTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('pending', 'banned', 'rejected', 'suspended', 'closed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      suspendedUntil: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa bảng Reports
    await queryInterface.dropTable('Reports');
  },
};
