module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("messages", "attachmentPublicId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("messages", "attachmentResourceType", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("messages", "attachmentResourceType");
    await queryInterface.removeColumn("messages", "attachmentPublicId");
  },
};
