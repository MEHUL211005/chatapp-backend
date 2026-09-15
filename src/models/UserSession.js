const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserSession extends Model {}

  UserSession.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      refreshTokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "UserSession",
      tableName: "user_sessions",
      timestamps: true,
    }
  );

  return UserSession;
};