const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("./config.json")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successully ");
  } catch (error) {
    console.log("Database connect failed \nError DB: " + error);
  }
};

module.exports = { connection };
