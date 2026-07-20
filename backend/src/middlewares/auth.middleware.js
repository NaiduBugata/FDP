const jwt = require('jsonwebtoken')
const { getJwtSecret } = require('../config/jwt')

const authMiddleware = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || ''
		const [scheme, token] = authHeader.split(' ')

		if (scheme !== 'Bearer' || !token) {
			return res.status(401).json({ message: 'Unauthorized: Missing token' })
		}

		const decoded = jwt.verify(token, getJwtSecret())
		req.user = decoded
		return next()
	} catch (error) {
		return res.status(401).json({ message: 'Unauthorized: Invalid token' })
	}
}

module.exports = authMiddleware
