const setCookies = (cookies = []) => {
  return (req, res) => {
    const origin = req.get('origin') || req.get('referer') || '';
    let domain = '';

    if (origin.includes('admin.training-move-capstone.madlab.tech')) {
      domain = 'admin.training-move-capstone.madlab.tech'; 
    } else if (origin.includes('training-move-capstone.madlab.tech')) {
      domain = 'training-move-capstone.madlab.tech'; 
    }

    cookies.forEach(({ name, value, days, options = {} }) => {
      const finalOptions = {
        domain,
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

const clearCookies = (cookies = []) => {
  return (req, res) => {
    const origin = req.get('origin') || req.get('referer') || '';
    let domain = '';

    if (origin.includes('admin.training-move-capstone.madlab.tech')) {
      domain = 'admin.training-move-capstone.madlab.tech'; 
    } else if (origin.includes('training-move-capstone.madlab.tech')) {
      domain = 'training-move-capstone.madlab.tech'; 
    }

    cookies.forEach(({ name, options = {} }) => {
      const finalOptions = {
        domain,
        path: '/',
        secure: true,
        sameSite: 'None',
        ...options,
      };
      res.clearCookie(name, finalOptions);
    });
  };
};

module.exports = { setCookies, clearCookies }