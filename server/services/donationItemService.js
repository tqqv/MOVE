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

const getDonationItemById = async(donationItemId) => {
  try {
    const donationItem = await DonationItem.findByPk(donationItemId)

    if(!donationItem) {
      return {
        status: 400,
        data: null,
        message: "donation item not found"
      }
    }

    return {
      status: 200,
      data: donationItem,
      message: "Get donation item by id successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const editDonationItem = async(donationItemId, data) => {
  try {
    // Tìm DonationItem trong DB
    const donationItem = await DonationItem.findByPk(donationItemId)
    if(!donationItem) {
      return {
        status: 400,
        data: null,
        message: "donation item not found"
      }
    }

    await donationItem.update(data)

    return {
      status: 200,
      data: donationItem,
      message: "donation item edit successfully."
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const deleteDonationItem = async (donationItemId) => {
  try {
    const donationItem = await DonationItem.findByPk(donationItemId);
    if (!donationItem) {
      return {
        status: 404,
        data: null,
        message: "donation item not found."
      };
    }

    await donationItem.destroy();

    return {
      status: 200,
      data: null,
      message: "donation item deleted successfully."
    };

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    };
  }
};


module.exports = {
  createDonationItem,
  getAllDonationItem,
  getDonationItemById,
  editDonationItem,
  deleteDonationItem
}
