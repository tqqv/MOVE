const db = require("../models/index.js");
const { Livestream } = db;

const createLivestream = async(data) => {
  try {
    if(!data){
      return {
        status: 400,
        data: null,
        message: 'Cannot be empty'
      }
    }
    const newLiveStream = await Livestream.create(data)
    console.log(data.streamerId);
    _io.to(data.streamerId).emit('streamPublished', true);
    return {
      status: 200,
      data: newLiveStream,
      message: 'Created livestream successfully'
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
  createLivestream
}
