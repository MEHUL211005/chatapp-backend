"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const sequelize = require("../config/database");
const setupAssociations = require("./associations");

const db = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file !== "associations.js" &&
      file.endsWith(".js") &&
      !file.endsWith(".test.js")
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );

    db[model.name] = model;
  });

// Setup all model associations
setupAssociations(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;