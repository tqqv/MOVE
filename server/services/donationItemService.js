const db = require("../models/index.js");
const { DonationItem, Donation, Comment, sequelize } = db;

const createDonationItem = async(data) => {
  try {
    if(!data.name || !data.image || !data.REPs){
      return {
        status: 400,
        data: null,
        message: 'Cannot be empty'
      }
    }

    if(data.REPs < 1) {
      return {
        status: 400,
        data: null,
        message: 'Invalid REPs. The REPs must be > 0.'
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
    const listCate = await DonationItem.findAll({
      order: [['REPs', 'asc']]
    })

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
    if(!donationItemId || !data){
      return {
        status: 400,
        data: null,
        message: "Cannot be empty."
      }
    }

    const donationItem = await DonationItem.findByPk(donationItemId)
    if(!donationItem) {
      return {
        status: 400,
        data: null,
        message: "donation item not found"
      }
    }

    if(data.REPs && data.REPs < 1) {
      return {
        status: 400,
        data: null,
        message: 'Invalid REPs. The REPs must be > 0.'
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

    const comment = await Comment.findOne({where: {donationItemId}})
    const donation = await Donation.findOne({where: {donationItemId}})

    if(comment || donation){
      return {
        status: 400,
        message: "This item is in use on comment or donation livestream."
      }
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
