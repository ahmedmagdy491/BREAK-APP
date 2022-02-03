const uid = function () {
	return Math.floor(100000 + Math.random() * 900000);
};

const UserDAO = require('../../dao/users.dao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => await bcrypt.hash(password, 10);

class User {
	constructor({ name, age, avatar, email, password, gender, id } = {}) {
		this.name = name;
		this.age = age;
		this.avatar = avatar;
		this.email = email;
		this.password = password;
		this.gender = gender;
		this.id = id;
	}
	toJson() {
		return {
			name: this.name,
			age: this.age,
			avatar: this.avatar,
			email: this.email,
			gender: this.gender,
			id: this.id,
		};
	}
	async comparePassword(plainText) {
		return await bcrypt.compare(plainText, this.password);
	}
	encoded() {
		return jwt.sign(
			{
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
				...this.toJson(),
			},
			process.env.SECRET_KEY
		);
	}
	static async decoded(userJwt) {
		return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
			if (error) {
				return { error };
			}
			return new User(res);
		});
	}
}

class UserController {
	static async register(req, res, next) {
		try {
			let userFromBody = req.body;
			const userInfo = {
				...userFromBody,
				password: await hashPassword(userFromBody.password),
				name: {
					first: userFromBody.first,
					last: userFromBody.last,
				},
			};
			const registerResult = await UserDAO.addUser(userInfo);
			res.status(201).json({
				resutl: {
					name: `${registerResult.name.first} ${registerResult.name.last}`,
					email: registerResult.email,
					avatar: registerResult.avatar,
					golds: registerResult.wallet.golds,
				},
			});
		} catch (error) {
			next(error);
			// res.status(500).json({ error });
		}
	}
	static async login(req, res) {
		try {
			const { email, password } = req.body;
			if (!email || typeof email !== 'string') {
				res.status(400).json({
					error: 'Bad email format, expected string.',
				});
				return;
			}
			if (!password || typeof password !== 'string') {
				res.status(400).json({
					error: 'Bad email format, expected string.',
				});
				return;
			}

			let userData = await UserDAO.getUser(email);
			if (!userData) {
				res.status(401).json({
					error: 'Make sure your email is correct.',
				});
				return;
			}
			const user = new User(userData);

			if (!(await user.comparePassword(password))) {
				res.status(401).json({
					error: 'Make sure your password is correct.',
				});
				return;
			}
			const loginResponse = await UserDAO.loginUser(
				user.email,
				user.encoded()
			);
			if (!loginResponse.success) {
				res.status(500).json({ error: loginResponse.error });
				return;
			}
			res.json({ auth_token: user.encoded(), info: user.toJson() });
		} catch (error) {
			console.log(error);
			res.status(400).json({ error });
			return;
		}
	}

	static async logout(req, res) {
		try {
			const userObj = req.user;
			const logoutResult = await UserDAO.logoutUser(userObj.email);

			if (logoutResult.error) {
				res.status(500).json({ error: logoutResult.error });
				return;
			}
			res.json(logoutResult);
		} catch (error) {
			res.status(500).json({ error });
		}
	}

	static async delete(req, res) {
		try {
			const { id } = req.params;
			const deleteResult = await UserDAO.deleteUser(id);
			if (!deleteResult.success) {
				res.status(500).json({ error: deleteResult.error });
				return;
			}
			res.json(deleteResult);
		} catch (error) {
			res.status(500).json({ error });
		}
	}

	static async FollowSomeOne(req, res, next) {
		try {
			const { id } = req.user;
			const { id_to_follow } = req.body;
			const followResult = await UserDAO.Follow(id, id_to_follow);

			res.json(followResult);
		} catch (error) {
			next(error);
		}
	}

	static async UnfollowSomeOne(req, res, next) {
		try {
			const { id } = req.user;
			const { id_to_unfollow } = req.body;
			const followResult = await UserDAO.Unfollow(id, id_to_unfollow);
			res.json(followResult);
		} catch (error) {
			next(error);
		}
	}

	static async getFollowers(req, res, next) {
		try {
			const { id } = req.user;
			const followersResult = await UserDAO.getFollowers(id);
			res.json(followersResult);
		} catch (error) {
			next(error);
		}
	}
	static async addVisitor(req, res, next) {
		try {
			const { id } = req.user; // id of visitor user
			const { user_to_visit } = req.body; //  id of user to visit
			const followersResult = await UserDAO.addVisitor(id, user_to_visit);

			res.json(followersResult);
		} catch (error) {
			next(error);
		}
	}

	static async buyProduct(req, res, next) {
		try {
			const { id } = req.user;

			/**
			 * @constant { string } product | the id of the product to buy
			 *  @constant { number } quantity | the number of of product's quantity
			 **/
			const { product, quantity } = req.body;
			const info = {
				buyer: id,
				product,
				quantity,
			};

			const buyResult = await UserDAO.buyProduct(info);

			res.status(200).json(buyResult);
		} catch (error) {
			next(error);
		}
	}

	static sendGift(req, res, next) {
		new Promise(async (resolve, reject) => {
			try {
				const sendResult = await UserDAO.sendGifts({
					...req.body,
					sender: req.user.id,
				});
				if (!sendResult.modifiedCount) {
					reject(
						res.status(400).json({
							success: false,
							msg: 'something went wrong, please try again later',
						})
					);
					return;
				}
				resolve(
					res.status(200).json({
						success: true,
						msg: 'your gift has been sent successfully',
					})
				);
			} catch (error) {
				reject(next(error));
			}
		});
	}

	static convertCurrence(req, res, next) {
		return new Promise(async (resolve, reject) => {
			try {
				const { id } = req.user;
				const { quantity } = req.body;
				const convertResult = await UserDAO.convertCurrence({
					user_id: id,
					quantity,
				});
				res.json(convertResult);
			} catch (error) {
				reject(next(error));
			}
		});
	}
}

module.exports = { UserController, User, uid };
