const StoreDAO = require('../../dao/store.dao');

class StoreController {
	static async addProduct(req, res, next) {
		try {
			const proudctResult = await StoreDAO.addProduct(req.body);
			res.status(201).json({
				success: true,
				result: proudctResult,
			});
		} catch (error) {
			next(error);
		}
	}

	static async addCategory(req, res, next) {
		try {
			const categoryResult = await StoreDAO.addCategory(req.body);
			res.status(201).json({
				success: true,
				result: categoryResult,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getCategoryProducts(req, res, next) {
		try {
			const result = await StoreDAO.getCategoryProducts(
				req.params.category_id
			);
			res.json({
				result,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getCategories(req, res, next) {
		try {
			const result = await StoreDAO.getCategories();
			res.json({
				result,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = StoreController;
