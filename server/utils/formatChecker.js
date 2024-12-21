const isValidUUID = (room) => {
    // Regex cho UUID v4 (36 ký tự, bao gồm 4 dấu gạch ngang)
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(room);
};

module.exports = {
    isValidUUID
}
