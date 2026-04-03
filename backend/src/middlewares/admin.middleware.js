const adminMiddleware = (req, res, next) => {
	if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
		return res.status(403).json({ message: 'Forbidden: Admin access required' })
	}

	return next()
}

module.exports = adminMiddleware
