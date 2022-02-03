const errorHandler = (err, req, res, next) => {
    console.log('err', err);
    let error = { ...err };
    error.message = err.message;

    // Mongo bad Id
    if (err.name === 'CastError') {
        error = {
            message: 'Resource not found',
            statusCode: 404,
        };
    }

    // mongo dublicate Field
    if (err.code === 11000) {
        const fields = Object.keys(err.keyValue);
        const message = fields.map((f) => `this ${f} is alrady in use`);
        error = {
            message: message[0],
            statusCode: 400,
        };
    }

    // mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = {
            message,
            statusCode: 400,
        };
    }

    res.status(error.statusCode || 500).json({
        error: error.message || 'Server Error',
    });
};

module.exports = errorHandler;
