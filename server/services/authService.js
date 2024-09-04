var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const { User } = db;

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
    });

    await newUser.save();

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
    // data: { ...rest },
  };
};

module.exports = {
  login,
  register,
};
