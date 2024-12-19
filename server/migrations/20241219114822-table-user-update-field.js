'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm unique constraint cho cột email
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa unique constraint khỏi cột email
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });

    await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });
  },
};
