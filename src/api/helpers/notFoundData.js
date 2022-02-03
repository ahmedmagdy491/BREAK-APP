const checkDataExist = (data) => {
    if (!data) {
        const error = {
            message: 'NOT_FOUND',
            statusCode: 404,
        };
        throw error;
    }
};

module.exports = checkDataExist;
