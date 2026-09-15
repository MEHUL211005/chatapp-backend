const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {}

  Invitation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("pending", "used", "revoked"),
        allowNull: false,
        defaultValue: "pending",
      },

      invitedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Invitation",
      tableName: "invitations",
      timestamps: true,
    }
  );

  return Invitation;
};