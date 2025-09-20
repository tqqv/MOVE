const setCookies = (cookies = []) => {
  return (req, res) => {
    cookies.forEach(({ name, value, days, options = {} }) => {
      const finalOptions = {
        path: '/',
        secure: true,
        sameSite: 'None',
        httpOnly: true, // thêm cho accessToken
        maxAge: days * 24 * 60 * 60 * 1000,
        ...options,
      };
      res.cookie(name, value, finalOptions);
    });
  };
};

const clearCookies = (cookies = []) => {
  return (req, res) => {
    cookies.forEach(({ name, options = {} }) => {
      const finalOptions = {
        path: '/',
        secure: true,
        sameSite: 'None',
        httpOnly: true,
        ...options,
      };
      res.clearCookie(name, finalOptions);
    });
  };
};

module.exports = { setCookies, clearCookies };
