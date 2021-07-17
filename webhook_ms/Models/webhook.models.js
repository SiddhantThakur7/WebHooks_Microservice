const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const webhookSchema = new Schema({
	target_url: {
		type: 'String',
		required: true
	},
	user_id: {
		type: Schema.Types.ObjectId,
		required: true
	  }
}, {
	timestamps: true
});

module.exports = mongoose.model('webhook', webhookSchema);
