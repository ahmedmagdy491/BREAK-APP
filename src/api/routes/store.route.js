const StoreController = require('../controllers/store.controller');

const router = require('express').Router();

router.route('/addProduct').post(StoreController.addProduct);
router
	.route('/category')
	.post(StoreController.addCategory)
	.get(StoreController.getCategories);
router
	.route('/getCategoryProducts/:category_id')
	.get(StoreController.getCategoryProducts);

module.exports = router;
