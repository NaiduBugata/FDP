const siteSettingsService = require('../services/siteSettings.service')

const getSettings = async (req, res, next) => {
	try {
		const data = await siteSettingsService.getSettings()
		return res.status(200).json({ message: 'Site settings fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const updateSettings = async (req, res, next) => {
	try {
		const data = await siteSettingsService.updateSettings(req.body || {})
		return res.status(200).json({ message: 'Site settings updated successfully', data })
	} catch (error) {
		return next(error)
	}
}

module.exports = {
	getSettings,
	updateSettings,
}
