const { validationResult } = require('express-validator');

const formatedValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            value: error.value,
            msg: error.msg,
            param: error.param,
        };
    },
});

const catchValidationError = (req, res, next) => {
    const result = formatedValidationResult(req);
    console.log(result);
    if (!result.isEmpty()) {
        return res.status(422).json({
            message: 'VALIDATION_ERROR',
            errors: result.array(),
        });
    }
    next();
};

module.exports = { catchValidationError };
