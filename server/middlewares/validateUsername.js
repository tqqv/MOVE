const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9._]+$/;
    return regex.test(username);
}

module.exports = validateUsername
