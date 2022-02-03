const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
	beans_golds: {
		type: Number,
		required: [true, 'there is no equation between golds and beans'],
		default: 4,
	},
});

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
