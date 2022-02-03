const SettingsDAO = require('../../dao/settings.dao');
class SettingsController {
	static async CreateSettings(req, res, next) {
		try {
			const createResult = await SettingsDAO.createSettings(req.body);
			res.json({ result: createResult });
		} catch (error) {
			next(error);
		}
	}

	static async EditOnSettings(req, res, next) {
		try {
			const editResult = await SettingsDAO.EditOnSettings(req.body);
			res.json({ result: editResult });
		} catch (error) {
			next(error);
		}
	}

	static async GetSettings(req, res, next) {
		try {
			res.json({ result: await SettingsDAO.GetSettings() });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = SettingsController;
