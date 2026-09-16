module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("messages", "isEdited", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("messages", "isDeleted", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "messages",
      "isDeleted"
    );

    await queryInterface.removeColumn(
      "messages",
      "isEdited"
    );
  },
};