const mongoose = require('mongoose');
const productCategorySchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.String,
			required: [true, 'document must have an id'],
		},
		name: {
			type: String,
			required: true,
			unique: true,
		},
		avatar: {
			type: String,
			default: 'avatar default',
		},
	},
	{ timestamps: true }
);
const storeSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.String,
			required: [true, 'document must have an id'],
		},
		name: {
			type: String,
			required: [true, 'this field is required'],
			unique: [true, 'this product is already exists'],
		},
		price: {
			type: Number,
			required: [true, 'this field is required'],
		},
		description: {
			type: String,
			required: [true, 'this field is required'],
		},
		category: {
			type: mongoose.Schema.Types.String,
			ref: 'ProductCategory',
			required: true,
		},
		avatar: {
			type: String,
			default: 'avatar default',
		},
	},
	{ timestamps: true }
);

const Store = mongoose.model('Store', storeSchema);
const ProductCategory = mongoose.model(
	'ProductCategory',
	productCategorySchema
);
module.exports = { Store, ProductCategory };
