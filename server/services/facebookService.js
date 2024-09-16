var { generateJwtToken } = require("./authService");

const loginByFacebook = async (error, user) => {
  if (error) {
    return {
      status: 500,
      message: error.message,
    };
  }

  if (!user) {
    return {
      status: 400,
      message: "User not found",
    };
  }

  try {
    const token = await generateJwtToken(user);
    return {
      cookie: {
        cookieName: "accessToken",
        token: token,
        expires: token.expiresIn,
      },
      status: 200,
      message: "Successfully login with Facebook",
      data: {
        token: token,
        role: user.role,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

module.exports = {
  loginByFacebook,
};
