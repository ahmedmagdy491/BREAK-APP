const { User } = require('../schemas/users.schema');
const Session = require('../schemas/sessions.schema');
const { Store } = require('../schemas/store.schema');
const ObjectId = require('mongoose').Types.ObjectId;
const Settings = require('../schemas/settings.schema');
const idGenerator = require('../api/helpers/idGenerator');
class UserDAO {
	/**-----------------------
     *  For this ticket, you will need to implement the following methods:
     * 
     * - getUser 
     * - addUser   
     * - loginUser  
     * - logoutUser
     * - deleteUser  
     
     * You can find these methods below this comment. Make sure to read the     comments Sin each method to better understand the implementation.
     *------------------------**/

	/**
	 * Finds a user in the `users` collection
	 * @param {string} email - The email of the desired user
	 * @returns {Object | null} Returns either a single user or nothing
	 */
	static async getUser(email) {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(await User.findOne({ email }));
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Adds a user to the `users` collection
	 * @param {UserInfo} userInfo - The information of the user to add
	 */
	static addUser(userInfo) {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(await User.create({ ...userInfo, _id: idGenerator() }));
			} catch (error) {
				reject(error);
				// throw error;
			}
		});
	}

	/**
	 * Adds a user to the `sessions` collection
	 * @param {string} email - The email of the user to login
	 * @param {string} jwt - A JSON web token representing the user's claims
	 * @returns {DAOResponse} Returns either a "success" or an "error" Object
	 */
	static async loginUser(email, jwt) {
		try {
			const session = await Session.updateOne(
				{ email },
				{ $set: { jwt: jwt } }
			);

			if (!session.modifiedCount) {
				await Session.create({ email, jwt });
				return { success: true };
			}

			return { success: true };
		} catch (error) {
			console.error(`Error when logging user ${error}`);
			return { error };
		}
	}

	/**-----------------------
	 *  Remove user from sessions collections
	 *  @param {string} email // the email of user to remove
	 *  @returns {DAOResponse} Returns either a `success` or an `error` object
	 *------------------------**/
	static async logoutUser(email) {
		try {
			// Delete the document in the `sessions` collection matching the email.
			await Session.deleteOne({ email });
			return { success: true };
		} catch (error) {
			console.error(`Error occurred while logging out user, ${error}`);
			return { error };
		}
	}

	/**
	 * Gets a user from the `sessions` collection
	 * @param {string} email - The email of the user to search for in `sessions`
	 * @returns {Object | null} Returns a user session Object, an "error" Object
	 * if something went wrong, or null if user was not found.
	 */
	static async getUserSession(email) {
		try {
			// TODO Ticket: User Management
			// Retrieve the session document corresponding with the user's email.
			return Session.findOne({ email });
		} catch (e) {
			console.error(`Error occurred while retrieving user session, ${e}`);
			return null;
		}
	}

	/**
	 * Removes a user from the `sessions` and `users` collections
	 * @param {string} id - The id of the user to delete
	 * @returns {DAOResponse} Returns either a "success" or an "error" Object
	 */
	static async deleteUser(id) {
		try {
			await User.findByIdAndDelete(id);
			await Session.findByIdAndDelete(id);
			if (!(await this.getUser(id)) && !(await this.getUserSession(id))) {
				return { success: true };
			} else {
				console.error(`Deletion unsuccessful`);
				return { error: `Deletion unsuccessful` };
			}
		} catch (error) {
			console.error(`Error occurred while deleting user, ${error}`);
			return { error };
		}
	}

	/**-----------------------
	 *  add user_id to `followings` field in his document
	 *  @param {number} user_id // the id of user you want to follow
	 *  @param {number} id_to_follow // the id of user you want to follow
	 *  @returns {DAOResponse} // return either success or an error object
	 *------------------------**/

	static Follow(user_id, id_to_follow) {
		return new Promise(async (resolve, reject) => {
			try {
				const followResult = await User.updateOne(
					{
						_id: user_id,
						followings: { $nin: [id_to_follow] },
					},
					{ $push: { followings: id_to_follow } }
				);
				if (!followResult.matchedCount) {
					reject(new Error('you already follow this user.'));
					return;
				}
				resolve({ success: true });
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 *  add user_id to `followings` field in his document
	 *  @param {number} user_id // the id of user you want to unfollow
	 *  @param {number} id_to_unfollow
	 **/
	static async Unfollow(user_id, id_to_unfollow) {
		return new Promise(async (resolve, reject) => {
			try {
				const unfollowResult = await User.updateOne(
					{
						_id: user_id,
						followings: { $in: [id_to_unfollow] },
					},
					{ $pull: { followings: id_to_unfollow } }
				);
				if (!unfollowResult.matchedCount) {
					reject(new Error('you do not follow this user after now'));
					return;
				}
				resolve({ success: true });
			} catch (error) {
				console.log(error);
				reject(error);
			}
		});
	}

	/**
	 *  add user_id to `followings` field in his document
	 *  @param {string} user_id // the id of user that has followers
	 **/
	static async getFollowers(user_id) {
		return new Promise(async (resolve, reject) => {
			try {
				const getFollowersResult = await User.find(
					{
						_id: { $ne: user_id },
						followings: { $in: [user_id] },
					},
					{ name: 1, avatar: 1 }
				);
				resolve(getFollowersResult);
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 *  add user_id to `followings` field in his document
	 *  @param {string} user_id // the id of visitor user
	 *  @param {string} user_to_visit // the id of user you want to visit
	 **/
	static async addVisitor(user_id, user_to_visit) {
		return new Promise(async (resolve, reject) => {
			try {
				await User.updateOne(
					{ _id: user_id, visits: { $nin: [user_to_visit] } },
					{ $push: { visits: user_to_visit } }
				);

				resolve({ success: true });
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 *  buy product.. either (push) new product or update it
	 *  @param {object} info // the informations of buying process
	 *  @returns {object} // return result of the query
	 **/
	static buyProduct(info) {
		return new Promise(async (resolve, reject) => {
			try {
				let { buyer, product, quantity } = info;
				const productDB = await Store.findById(product, {
					price: 1,
					_id: 0,
				});
				if (!productDB) {
					reject(new Error('this product may be deleted'));
					return;
				}
				let totalPrice = productDB.price * quantity;

				// if product already exist in products array
				let saleResult = await User.updateOne(
					{
						_id: buyer,
						'wallet.golds': { $gte: totalPrice },
						'products.id': product,
					},
					{
						$inc: {
							'products.$.quantity': quantity,
							'wallet.golds': -totalPrice,
						},
					}
				);

				// if product doesn't exist in products array
				if (!saleResult.matchedCount) {
					saleResult = await User.updateOne(
						{
							_id: buyer,
							'wallet.golds': { $gte: totalPrice },
							'products.id': { $ne: product },
						},
						{
							$push: {
								products: { id: product, quantity },
							},
							$inc: {
								'wallet.golds': -totalPrice,
							},
						}
					);

					// if the buyer has no golds enough to buy products
					if (!saleResult.matchedCount) {
						reject(new Error("you don't have enough golds"));
						return;
					}
				}
				resolve(saleResult);
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 *  buy product.. either (push) new product or update it
	 *  @param {object} gift_info // the informations of sending gifts process
	 **/
	static sendGifts(gift_info) {
		return new Promise(async (resolve, reject) => {
			try {
				const { gift_id, gift_qty, reciever, sender } = gift_info;

				const [gift_value, settings] = await Promise.all([
					Store.findById(gift_id, { _id: 0, price: 1 }),
					Settings.findOne({}, { beans_golds: 1, _id: 0 }),
				]);

				// if the user has this gift and quantity allow to send this gift,
				// reduce the his product quantity by 'quantity of gift'
				let sendGiftResult = await User.updateOne(
					{
						_id: sender,
						products: {
							$elemMatch: {
								id: gift_id,
								quantity: { $gte: gift_qty },
							},
						},
					},
					{
						$inc: {
							'products.$.quantity': -gift_qty,
						},
					}
				);

				// if user has 0 of this product
				if (!sendGiftResult.modifiedCount) {
					reject(
						new Error(
							'your product quantity is less than gift quantity'
						)
					);
					return;
				}

				// if the gift quantity was reduced from the sender,
				// then increase the 'beans' of the reciever
				if (sendGiftResult.modifiedCount) {
					sendGiftResult = await User.updateOne(
						{ _id: reciever },
						{
							$inc: {
								'wallet.beans':
									(gift_value.price / settings.beans_golds) *
									gift_qty,
							},
						}
					);

					// if gift wasn't sent to receiver
					if (!sendGiftResult.modifiedCount) {
						reject(
							new Error(
								'error occured while sending gift, please do not worry about your gift we will resend it later.'
							)
						);

						return;
					}
				}
				resolve(sendGiftResult);
			} catch (error) {
				reject(error);
			}
		});
	}

	static convertCurrence({ user_id, quantity }) {
		return new Promise(async (resolve, reject) => {
			try {
				const settings = await Settings.findOne({}, { beans_golds: 1 });
				if (quantity < settings.beans_golds) {
					reject(
						new Error(
							'quantity is invalid, it must at least ' +
								settings.beans_golds +
								' beans'
						)
					);
					return;
				}
				console.log(user_id);
				const convertResult = await User.updateOne(
					{
						_id: user_id,
						'wallet.beans': {
							$gte: quantity,
						},
					},
					{
						$inc: {
							'wallet.golds': quantity / settings.beans_golds,
							'wallet.beans': -quantity,
						},
					}
				);
				if (!convertResult.matchedCount) {
					reject(
						new Error(
							'your beans is not enough to convert them to golds, you must have at lease ' +
								settings.beans_golds +
								' beans.'
						)
					);
					return;
				}
				resolve({ success: convertResult });
			} catch (error) {
				console.log('errrrr', error);
				reject(error);
			}
		});
	}
}

/**======================
 *   parameter passed to addUser method
 *  @typedef UserInfo
 *  @property { object } name
 *  @property { number } age
 *  @property { string } avatar
 *  @property { string } email
 *  @property { string } password
 *  @property { string } gender
 *  @property { string } phone
 *========================**/

/**-----------------------
 * 	parameter passed to addfriendrequest method
 *  @typedef RequestInfo
 *  @property {number} requester
 *  @property {number} recipiant
 *  @property {number} request_id
 *------------------------**/

/**======================
 *  Success/Error return object
 *  @typedef DAOResponse
 *  @property { boolean } [success] //Success
 *  @property { string } [error] // Error
 *========================**/

module.exports = UserDAO;
