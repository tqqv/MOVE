const db = require("../models/index.js");
const { RepPackage } = db;

const getListRepPackage = async() => {
  try {
    const list = await RepPackage.findAll();

    return {
      status: 200,
      data: list,
      message: "Retrieve rep package success."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

module.exports = {
  getListRepPackage,
}
