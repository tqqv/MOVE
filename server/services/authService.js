var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const { User, RequestChannel } = db;
var nodemailer = require("nodemailer");
const { createChannel } = require("./channelService.js");
const { randomFixedInteger } = require("../utils/generator.js");

const generateJwtToken = (user) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15d" }
      );
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};

const register = async (userData) => {
  try {
    const user = await User.findOne({
      where: { email: userData.email },
    });

    if (user) {
      return {
        status: 400,
        message: "Email already exists",
      };
    }

    const conditions = {
      lowercase: /[a-z]/.test(userData.password),
      uppercase: /[A-Z]/.test(userData.password),
      number: /[0-9]/.test(userData.password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(userData.password),
      minLength: userData.password.length >= 8,
      email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(
        userData.email
      ),
      // username: userData.username.length >= 6,
    };

    if (!conditions.email) {
      return {
        status: 400,
        message: "Invalid email format",
      };
    }

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

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userData.password, salt);
    const newUser = new User({
      email: userData.email,
      password: hash,
      avatar: "https://img.upanh.tv/2024/06/18/user-avatar.png"
    });

    const savedUser = await newUser.save();

    const referralCode = 1000 + savedUser.dataValues.id;

    savedUser.referralCode = referralCode;

    await savedUser.save();
    //
    // Nếu tạo bảng để link cái referralCode thì Viết logic code ở đây
    // Code here

    return {
      status: 200,
      message: "Successfully created",
    };
  } catch (error) {
    return {
      status: 400,
      message: error.message,
    };
  }
};

const login = async (userData) => {
  // console.log(userData);
  const user = await User.findOne({
    where: { email: userData.email },
  });

  if (!user) {
    return {
      status: 400,
      message: "Email does not exist",
    };
  }

  const checkCorrectPassword = await bcrypt.compare(
    userData.password,
    user.password
  );

  if (!checkCorrectPassword) {
    return {
      status: 400,
      message: "Incorrect email or password",
    };
  }

  // console.log(user.dataValues);

  // const { password, role, ...rest } = user.dataValues;

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15d" }
  );

  // set token in cookies
  console.log("token: " + token);
  return {
    cookie: {
      cookieName: "accessToken",
      token: token,
      expires: token.expiresIn,
    },
    status: 200,
    message: "Successfully login",
    data: {
      token: token,
      role: user.dataValues.role,
    },
  };
};

// setup mail and generate token - START
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASSWORD,
    user: "duyan3k@gmail.com",
    pass: "weifwabvmsbynnxl",
  },
});

const generateVerificationToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });
};

const generateDigitCodeToken = (code, email) => {
  return jwt.sign({ code, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5m",
  });
};
// setup mail and generate token - END

// Send mail and verify account - START
const sendMailVerify = async (email, id) => {
  try {
    const emailCheck = await User.findOne({ where: { email: email } });
    // console.log(emailCheck);
    if (emailCheck && emailCheck.id !== id) {
      return {
        status: 400,
        message: "Email has been exists",
      };
    }

    // console.log(user);
    const verificationToken = generateVerificationToken(id, email);

    const verificationUrl = `${process.env.CLIENT_HOST}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"MOVE ADMIN" <duyan3k@gmail.com>`,
      to: email,
      subject: "Email Verification With MOVE",
      html: `
        <h2 style="color: #04ddb2;">Reset Your Password</h2>
        <p>Dear ${email},</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: white; background-color: #04ddb2; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>Thank you,<br> Move Team</p>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    return {
      status: 200,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Send verification email error:", error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

const verifyAccount = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return {
        status: 400,
        message: "User not found",
      };
    }

    // Nếu user đổi email
    if (user.email !== decoded.email) {
      user.email = decoded.email;
    }

    user.isVerified = true;
    await user.save();

    return {
      status: 200,
      message: "Email verified successfully",
    };
  } catch (error) {
    console.error("Email verification error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return {
        status: 400,
        message: "Invalid or expired token",
      };
    }
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};
//// Send mail and verify account - END

// logic Forgot password - START
const forgotPassword = async (email) => {
  console.log(email);
  try {
    const user = await User.findOne({ where: { email: email } });
    const token = generateVerificationToken(user.id, email);
    var mailOptions = {
      from: `"MOVE ADMIN" <duyan3k@gmail.com>`,
      to: user.email,
      subject: "Reset Password - Move",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #04ddb2;">Reset Your Password</h2>
            <p>Dear ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${process.env.CLIENT_HOST}/reset_password/${token}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: white; background-color: #04ddb2; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <p>Thank you,<br> Move Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 200,
      message: "Mail sent successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

const verifyTokenRs = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return {
      status: 200,
      data: {
        userId: decoded.userId,
        email: decoded.email,
      },
      message: "Token valid.",
    };
  } catch (error) {
    console.error("Token verification error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return {
        status: 400,
        data: null,
        message: "Invalid or expired token",
      };
    }
    return {
      status: 500,
      data: null,
      message: "Internal server error",
    };
  }
};

const resetPassword = async (email, userId, newPassword, confirmPassword) => {
  try {
    const user = await User.findOne({ where: { id: userId, email: email } });
    if (!user) {
      return {
        status: 400,
        message: "User not found.",
      };
    }

    const conditions = {
      lowercase: /[a-z]/.test(newPassword),
      uppercase: /[A-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      minLength: newPassword.length >= 8,
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

    if (newPassword === confirmPassword) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);
      // console.log("new mk ", hash);
      user.password = hash;
      await user.save();
    } else {
      return {
        status: 400,
        message: "Check your confirm password",
      };
    }

    return {
      status: 200,
      message: "Password updated successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
    };
  }
};
// logic Forgot password - END

const getProfile = async (id) => {
  try {
    const user = await User.findByPk(id);
    if(!user){
      return {
        status: 200,
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

const statusRequestChannel = async(userId, status) => {
  // API của admin
  try {
    const request = await RequestChannel.findOne({
      where: {
        userId: userId
      }
    })
    if(!request){
      return {
        status: 400,
        message: "Request not found."
      }
    }

    const user = await User.findByPk(userId);

    if(!user) {
      return {
        status: 400,
        message: "User not found"
      }
    }

    request.status = status;
    await request.save()

    if(status === "approved") {
      await createChannel(userId);
      user.role = "streamer";
      await user.save();
    }

    return {
      status: 200,
      message: "Update status successfully."
    }

  } catch (error) {
    return {
      status: 500,
      message: error.message
    }
  }
}

// Facebook send mail and verify account - START
const sendMailVerifyFacebook = async (email, fullName) => {
  try {
    // generate secret 6 digit - then store in token,
    const sixDigitCode = randomFixedInteger(6)
    const verificationToken =  generateDigitCodeToken(sixDigitCode, email);
    console.log("6 - digit code: ", sixDigitCode)
    // const verificationToken = generateVerificationTokenFacebook(facebookId, email, fullName);
    const mailOptions = {
      from: `"MOVE ADMIN" <duyan3k@gmail.com>`,
      to: email,
      subject: "Email Verification With MOVE Login By Facebook",
      html: `
        <h2 style="color: #04ddb2;">Confirmation code</h2>
        <p>Dear ${fullName},</p>
        <p>Here is your 6-digit code: ${sixDigitCode} </p>
        <p>Thank you,<br> Move Team</p>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    return {
      cookie: {
        cookieName: "digitVerificationToken",
        token: verificationToken,
        expires: verificationToken.expiresIn,
      },
      status: 200,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Send verification email error:", error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

const verifyAccountFacebook = async (accountInfor, token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const isValid = (accountInfor.code == decoded.code) && (accountInfor.email == decoded.email);
    const existEmailAccount = await User.findOne({ where: { email: accountInfor.email } });
    // Check if the email already exists
    if (existEmailAccount) {
      return {
        status: 400,
        message: "Email already exists",
      };
    } else if (isValid) {
        const user = await User.create(accountInfor)
        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "15d" }
        );
        return {
          cookie: {
            cookieName: "accessToken",
            token: token,
            expires: token.expiresIn,
          },
          status: 200,
          message: "Email verified successfully",
        };
    } else if (!isValid) {
      return {
        status: 400,
        message: "Invalid 6-digit code or Email",
      };
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return {
        status: 400,
        message: "Invalid or expired token",
      };
    }
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};
//// Send mail and verify account - END

module.exports = {
  login,
  register,
  sendMailVerify,
  forgotPassword,
  verifyAccount,
  resetPassword,
  verifyTokenRs,
  getProfile,
  editProfile,
  changePassword,
  requestChannel,
  statusRequestChannel,
  generateJwtToken,
  sendMailVerifyFacebook,
  verifyAccountFacebook
};
