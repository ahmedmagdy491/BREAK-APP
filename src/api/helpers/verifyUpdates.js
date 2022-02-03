const verifyUpdates = (reqBody, validUpdates = []) => {
    const updates = Object.keys(reqBody);
    const isValidUpdates = updates.every((u) => validUpdates.includes(u));
    if (!isValidUpdates) {
        throw { message: 'Invalid Updates!', statusCode: 400 };
    }
    return;
};

module.exports = verifyUpdates;
