const db = require("../models/index.js");
const { SystemConfig } = db;

const createSystemConfig = async(data) => {
  try {
    if(!data.key || !data.value){
      return {
        status: 400,
        data: null,
        message: 'Cannot be empty'
      }
    }

    const check = await SystemConfig.findOne({where: {key: data.key}})

    if(check) {
      return{
        status: 400,
        message: 'The key already exists.'
      }
    }

    const systemConfig = await SystemConfig.create(data)

    return {
      status: 200,
      data: systemConfig,
      message: 'Created successfully'
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error.",
    };
  }
}

const getAllSystemConfig = async() => {
  try {
    const listSystemConfig = await SystemConfig.findAll()

    return {
      status: 200,
      data: listSystemConfig,
      message: "Get list system config successfully."
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error.",
    };
  }
}

const getSystemConfigByKey = async(key) => {
  try {
    if(!key) {
      return {
        status: 400,
        message: 'Cannot be empty.'
      }
    }
    const systemConfig = await SystemConfig.findOne({where: {key}})

    if(!systemConfig) {
      return {
        status: 400,
        data: null,
        message: "System Config not found"
      }
    }

    return {
      status: 200,
      data: systemConfig,
      message: "Get System Config by id successfully."
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error.",
    };
  }
}

const editSystemConfig = async(systemConfigId, value) => {
  console.log(systemConfigId, value);
  try {
    // Tìm DonationItem trong DB
    if(!value){
      return {
        status: 400,
        data: null,
        message: 'Cannot be empty'
      }
    }
    const systemConfig = await SystemConfig.findByPk(systemConfigId)
    if(!systemConfig) {
      return {
        status: 404,
        data: null,
        message: "System Config not found"
      }
    }

    await systemConfig.update({value: value})

    return {
      status: 200,
      data: systemConfig,
      message: "System config edit successfully."
    }

  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error.",
    };
  }
}


module.exports = {
  createSystemConfig,
  getSystemConfigByKey,
  getAllSystemConfig,
  editSystemConfig,
}
