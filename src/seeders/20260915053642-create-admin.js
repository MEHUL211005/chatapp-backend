"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    await queryInterface.bulkInsert("users", [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Admin",
        email: "admin3@gmail.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        lastSeen: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: "admin3@gmail.com",
    });
  },
};