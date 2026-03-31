const getJwtSecret = () => process.env.JWT_SECRET || 'change-this-secret-in-env'
const getJwtExpiry = () => process.env.JWT_EXPIRES_IN || '1d'

module.exports = {
	getJwtSecret,
	getJwtExpiry,
}
