"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename parentId to parentId
    await queryInterface.renameColumn("comments", "parentCommentId", "parentId");

    // Rename commentContent to content
    await queryInterface.renameColumn("comments", "commentContent", "content");
  },

  async down(queryInterface, Sequelize) {
    // Revert parentId back to parentId
    await queryInterface.renameColumn("comments", "parentId", "parentCommentId");

    // Revert content back to commentContent
    await queryInterface.renameColumn("comments", "content", "commentContent");
  },
};
