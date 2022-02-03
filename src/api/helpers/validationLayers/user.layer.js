const { check } = require('express-validator');

const validate = (method) => {
	switch (method) {
		case 'addUser': {
			return [
				check('first')
					.trim()
					.notEmpty()
					.withMessage('REQUIRED')
					.bail()
					.bail()
					.withMessage('your first name must more than 1 character')
					.isString('your first name must be string'),
				check('last')
					.trim()
					.notEmpty()
					.withMessage('REQUIRED')
					.bail()
					.bail()
					.withMessage('your first name must more than 1 character')
					.isString('your first name must be string'),
				check('age')
					.notEmpty()
					.bail()
					.withMessage('REQUIRED')
					.bail()
					.isNumeric('age must be number')
					.custom((value, req) => {
						if (value < 18) {
							return new Error('age must be 18 years or older');
						}
						return true;
					})
					// .withMessage('age must be 18 years or older')
					.bail(),
				check('password')
					.trim()
					.notEmpty()
					.withMessage('REQUIRED')
					.bail()
					.isStrongPassword({
						minLength: 8,
						minSymbols: 1,
						minLowercase: 1,
						minUppercase: 1,
					})
					.withMessage(
						'password must contains at least one uppdercase char, at least one lowercase char and at least one symbols'
					),
				check('email')
					.trim()
					.notEmpty()
					.withMessage('REQUIRED')
					.bail()
					.isEmail()
					.withMessage('Invalid Email')
					.bail()
					.isString('must be string'),
			];
		}
	}
};

module.exports = validate;
