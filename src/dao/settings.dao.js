const Settings = require('../schemas/settings.schema');
class SettingsDAO {
	static async createSettings(data) {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(await Settings.create(data));
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * @param {object} edit | object contains edit informations
	 **/
	static async EditOnSettings(edit) {
		try {
			const editResult = await Settings.findOneAndUpdate(
				{ _id: ObjectId(edit.settings_id) },
				req.body
			);
			return editResult;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @param {string} settings_id | the id of settings must get back
	 **/
	static async GetSettings() {
		return new Promise(async (resolve, reject) => {
			try {
				const settings = await Settings.findOne();
				// return settings;
				resolve(settings);
			} catch (error) {
				// throw error;
				reject(error);
			}
		});
	}
}

module.exports = SettingsDAO;
