const siteSettingsRepository = require('../repositories/siteSettings.repository')

const getSettings = () => siteSettingsRepository.getOrCreate()

const updateSettings = (payload) => siteSettingsRepository.update(payload)

module.exports = {
	getSettings,
	updateSettings,
}
