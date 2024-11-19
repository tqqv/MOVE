const db = require("../models/index.js");
const { DonationItem, sequelize } = db;

const createDonationItem = async(data) => {
  try {
    if(!data.name || !data.image){
      return {
        status: 400,
        data: null,
        message: 'Cannot be empty'
      }
    }

    const newDonationItem = await DonationItem.create(data)

    return {
      status: 200,
      data: newDonationItem,
      message: 'Created successfully'
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const getAllDonationItem = async() => {
  try {
    const listCate = await DonationItem.findAll()

    return {
      status: 200,
      data: listCate,
      message: "Get list Donation Item successfully."
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
  createDonationItem,getAllDonationItem
}
