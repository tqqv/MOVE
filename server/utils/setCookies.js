const setCookies = (cookies = []) => {
  return (req, res) => {
    let domain = null;
    if (req.hostname === 'localhost') {
      domain = req.hostname
    } else {
      domain = process.env.DOMAIN
    }
    cookies.forEach(({ name, value, days, options = {} }) => {
      const finalOptions = {
        domain: domain,
        path: '/',
        secure: true,
        sameSite: 'None',
        expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        ...options,
      }
      res.cookie(name, value, finalOptions);
    });
  };
};

module.exports = {setCookies}