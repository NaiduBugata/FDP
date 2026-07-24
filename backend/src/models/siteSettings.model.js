const mongoose = require('mongoose')

const siteSettingsSchema = new mongoose.Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
			default: 'main',
			trim: true,
		},
		whatsappJoinLink: {
			type: String,
			trim: true,
			default: 'https://chat.whatsapp.com/C7OcNsQlZ5n8LMCNucKvkf?s=sw&p=a&ilr=0',
			maxlength: 500,
		},
		whatsappJoinQr: {
			type: String,
			trim: true,
			default: '',
		},
		meetingLink: {
			type: String,
			trim: true,
			default: '',
			maxlength: 500,
		},
		meetingId: {
			type: String,
			trim: true,
			default: '',
			maxlength: 200,
		},
		meetingPassword: {
			type: String,
			trim: true,
			default: '',
			maxlength: 200,
		},
	},
	{
		timestamps: true,
		collection: 'site_settings',
	},
)

module.exports = mongoose.model('SiteSettings', siteSettingsSchema)
