const SiteSettings = require('../models/siteSettings.model')

const SETTINGS_KEY = 'main'

const DEFAULTS = {
	key: SETTINGS_KEY,
	whatsappJoinLink: 'https://chat.whatsapp.com/C7OcNsQlZ5n8LMCNucKvkf?s=sw&p=a&ilr=0',
	whatsappJoinQr: '',
	meetingLink: '',
	meetingId: '',
	meetingPassword: '',
}

const getOrCreate = async () => {
	let settings = await SiteSettings.findOne({ key: SETTINGS_KEY })
	if (!settings) {
		settings = await SiteSettings.create(DEFAULTS)
	}
	return settings
}

const update = async (payload = {}) => {
	const allowed = {
		whatsappJoinLink: payload.whatsappJoinLink,
		whatsappJoinQr: payload.whatsappJoinQr,
		meetingLink: payload.meetingLink,
		meetingId: payload.meetingId,
		meetingPassword: payload.meetingPassword,
	}

	Object.keys(allowed).forEach((key) => {
		if (allowed[key] === undefined) {
			delete allowed[key]
		}
	})

	const settings = await SiteSettings.findOneAndUpdate(
		{ key: SETTINGS_KEY },
		{ $set: allowed },
		{ new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
	)

	return settings
}

module.exports = {
	getOrCreate,
	update,
	DEFAULTS,
}
