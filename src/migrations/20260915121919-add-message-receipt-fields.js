"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "messages",
      "deliveredAt",
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      "messages",
      "readAt",
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "messages",
      "deliveredAt"
    );

    await queryInterface.removeColumn(
      "messages",
      "readAt"
    );
  },
};