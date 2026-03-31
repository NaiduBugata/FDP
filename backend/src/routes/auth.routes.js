const express = require('express')
const { body, validationResult } = require('express-validator')

const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	return next()
}

router.post(
	'/register',
	[
		body('username').trim().notEmpty().withMessage('Username is required'),
		body('email').isEmail().withMessage('Valid email is required'),
		body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
		body('role').optional().isIn(['admin', 'user']).withMessage('Role must be admin or user'),
	],
	validateRequest,
	authController.register,
)

router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Valid email is required'),
		body('password').notEmpty().withMessage('Password is required'),
	],
	validateRequest,
	authController.login,
)

router.get('/me', authMiddleware, authController.me)

module.exports = router
