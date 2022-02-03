const mongoose = require('mongoose');
const newsSchema = new mongoose.Schema({
	title: String,
	description: {
		type: String,
		required: true,
	},
});

const News = mongoose.model('News', newsSchema);

module.exports = { News };
