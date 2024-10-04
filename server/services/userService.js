const db = require("../models/index.js");
const { User, RequestChannel } = db;
const validateUsername = require("../middlewares/validateUsername.js");



const getProfile = async (id) => {
  try {
    const user = await User.findByPk(id);
    if(!user){
      return {
        status: 400,
        message: "User not found"
      }
    }

    return {
      status: 200,
      data: user,
      message: "Get profile successfully"
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message,
      data: null
    }
  }
}

const editProfile = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if(!user){
      return {
        status: 400,
        data: null,
        message: "User not found"
      }
    }

    if(data.role) {
      return {
        status: 400,
        data: null,
        message: "You can't change your role"
      }
    }

    if(user.email && user.isVerified) {
      return {
        status: 400,
        data: null,
        message: "You can't change your verified email"
      }
    }

    if(data.username){
      if (data.username.length < 3 || data.username.length > 32) {
        return {
          status: 400,
          data: null,
          message: "Must be between 3 and 32 in length."
        }
      } else if (!validateUsername(data.username)) {
        return {
          status: 400,
          data: null,
          message: "Please only use numbers, letters, underscores or periods."
        }
      }

      const user = await User.findOne({where: {username: data.username}})
      if(user) {
        return {
          status: 400,
          data: null,
          message: "Username already exists."
        }
      }
    }

    const updateUser = await user.update(data)
    if(!updateUser) {
      return {
        status: 400,
        data: null,
        message: "Update failed."
      }
    }

    return {
      status: 200,
      data: updateUser,
      message: "Update successfully."
    }
  } catch (error) {
    return {
      status: 400,
      data: null,
      message: error.message
    }
  }
}

const changePassword = async (userId, oldPass, newPass, confirmPass) => {
  try {
    const user = await User.findByPk(userId);

    if(!user) {
      return {
        status: 400,
        message: "User not found"
      }
    }

    const checkCorrectPassword = await bcrypt.compare(oldPass, user.password);

    if (!checkCorrectPassword) {
      return {
        status: 400,
        message: "Incorrect email or password",
      };
    }

    const conditions = {
      lowercase: /[a-z]/.test(newPass),
      uppercase: /[A-Z]/.test(newPass),
      number: /[0-9]/.test(newPass),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPass),
      minLength: newPass.length >= 8,
    };

    if (
      !conditions.lowercase ||
      !conditions.uppercase ||
      !conditions.number ||
      !conditions.specialChar ||
      !conditions.minLength
    ) {
      return {
        status: 400,
        message:
          "Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character",
      };
    }

    if (newPass !== confirmPass) {
      return {
        status: 400,
        message: "Check your confirm password",
      };
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPass, salt);

    user.password = hash;
    await user.save();

    return {
      status: 200,
      message: "Password updated successfully",
    };
  } catch (error) {
    return {
      status: 400,
      message: error.message
    }
  }
}

const requestChannel = async(userId) => {
  try {
    const user = await User.findByPk(userId)
    if(!user) {
      return {
        status: 400,
        message: "User not found"
      }
    }

    if(user.role !== "user") {
      return {
        status: 400,
        message: "You are not a User"
      }
    }

    const request = await RequestChannel.findOne({
      where : {
        userId: userId
      }
    })

    if (request) {
      const currentDate = new Date();
      const createdAt = new Date(request.createdAt);
      const daysDifference = Math.floor((currentDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDifference >= 15) {
        if (request.status === "rejected") {
          request.status = "pending";
          await request.save();

          return {
            status: 200,
            message: "Create request channel successfully."
          };
        } else {
          return {
            status: 400,
            message: "You can't send request."
          };
        }
      } else {
        return {
          status: 400,
          message: `Request must be older than 15 days. Please wait ${15 - daysDifference} days to send new request.`
        };
      }
    }


    await RequestChannel.create({userId: userId})

    return {
      status: 200,
      message: "Create request channel successfully."
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

const getRequestStatusById = async(userId) => {
  try {
    const result = await RequestChannel.findOne({where: {userId: userId}})
    if(!result) {
      return {
        status: 203,
        data: null,
        message: "Request not found"
      }
    }

    return {
      status: 200,
      data: result,
      message: "Get request successfully."
    }
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message
    }
  }
}

module.exports = {
  getProfile,
  editProfile,
  changePassword,
  getRequestStatusById,
  requestChannel
}
