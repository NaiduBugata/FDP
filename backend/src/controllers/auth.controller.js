const { validationResult } = require('express-validator')
const authService = require('../services/auth.service')

const register = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const user = await authService.register(req.body)
		return res.status(201).json({ message: 'User registered successfully', data: user })
	} catch (error) {
		return next(error)
	}
}

const login = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const result = await authService.login(req.body)
		return res.status(200).json({ message: 'Login successful', data: result })
	} catch (error) {
		return next(error)
	}
}

const me = async (req, res, next) => {
	try {
		const user = await authService.getProfile(req.user.id)
		return res.status(200).json({ message: 'Profile fetched successfully', data: user })
	} catch (error) {
		return next(error)
	}
}

module.exports = {
	register,
	login,
	me,
}
