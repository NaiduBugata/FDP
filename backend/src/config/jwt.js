const getJwtSecret = () => {
	const secret = process.env.JWT_SECRET

	if (!secret || secret.trim().length < 32 || secret === 'replace_with_strong_secret') {
		throw new Error('JWT_SECRET must be set to a strong value (minimum 32 chars)')
	}

	return secret
}

const getJwtExpiry = () => process.env.JWT_EXPIRES_IN || '1d'

module.exports = {
	getJwtSecret,
	getJwtExpiry,
}
