const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//The file contains the schema that the webhook data documents will follow

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
