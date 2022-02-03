const { check } = require('express-validator');

exports.validate = (method) => {
    switch (method) {
        case 'createRoom': {
            return [
                check('room_name')
                    .trim()
                    .notEmpty()
                    .withMessage('REQUIRED')
                    .bail()
                    .isLength({ min: 3, max: 15 })
                    .withMessage('NUMBER_MIN_3_MAX_15')
                    .isString()
                    .withMessage('must be string'),
            ];
        }
        default:
            return;
    }
};
