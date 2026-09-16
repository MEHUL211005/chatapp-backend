module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("messages", "attachmentUrl", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("messages", "attachmentName", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("messages", "attachmentSize", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.addColumn("messages", "attachmentMimeType", {
      type: Sequelize.STRING,
      allowNull: true,
    });

  },

  async down(queryInterface) {
    await queryInterface.removeColumn("messages", "attachmentMimeType");
    await queryInterface.removeColumn("messages", "attachmentSize");
    await queryInterface.removeColumn("messages", "attachmentName");
    await queryInterface.removeColumn("messages", "attachmentUrl");
  },
};