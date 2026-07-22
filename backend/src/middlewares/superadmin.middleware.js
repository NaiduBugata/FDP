const superadminMiddleware = (req, res, next) => {
	if (!req.user || req.user.role !== 'superadmin') {
		return res.status(403).json({ message: 'Forbidden: Super Admin access required' })
	}

	return next()
}

module.exports = superadminMiddleware
