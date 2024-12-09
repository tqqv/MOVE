const db = require("../models/index.js");
const { RepPackage, Payment } = db;

const getListRepPackage = async() => {
  try {
    const list = await RepPackage.findAll({
      order: [['rep', 'asc']]
    });

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

const createRepPackage = async(data) => {
  try {
    if(!data.rep || !data.amount){
      return {
        status: 400,
        data: null,
        message: 'Cannot be empty'
      }
    }

    let discount;

    if(!data.discount) {
      discount = 0
    }

    const newRepPackage = await RepPackage.create({
      rep: data.rep,
      amount: data.amount,
      discount: data.discount/100
    })

    return {
      status: 200,
      data: newRepPackage,
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

const getRepPackageById = async(repPackageId) => {
  try {
    const repPackage = await RepPackage.findByPk(repPackageId)

    if(!repPackage) {
      return {
        status: 400,
        data: null,
        message: "Rep Package not found"
      }
    }

    return {
      status: 200,
      data: repPackage,
      message: "Get Rep Package by id successfully."
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const editRepPackage = async(repPackageId, data) => {
  try {
    // Tìm RepPackage trong DB
    const repPackage = await RepPackage.findByPk(repPackageId)
    if(!repPackage) {
      return {
        status: 400,
        data: null,
        message: "Rep Package not found"
      }
    }

    await repPackage.update(data)

    return {
      status: 200,
      data: repPackage,
      message: "Rep Package edit successfully."
    }

  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message
    }
  }
}

const deleteRepPackage = async (repPackageId) => {
  try {
    const repPackage = await RepPackage.findByPk(repPackageId);

    if (!repPackage) {
      return {
        status: 404,
        data: null,
        message: "Rep Package not found."
      };
    }

    const payment = await Payment.findOne({where: {repPackageId}})

    if(payment){
      return {
        status: 400,
        message: "This rep package is in use on payment."
      }
    }

    await repPackage.destroy();

    return {
      status: 200,
      data: null,
      message: "Rep Package deleted successfully."
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
  getListRepPackage,
  createRepPackage,
  getRepPackageById,
  editRepPackage,
  deleteRepPackage
}
