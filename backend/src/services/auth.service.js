const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authRepository = require('../repositories/auth.repository')
const { getJwtSecret, getJwtExpiry } = require('../config/jwt')

const sanitizeUser = (user) => ({
	id: user._id,
	username: user.username,
	email: user.email,
	role: user.role,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
})

const register = async ({ username, email, password, role }) => {
	const existingEmail = await authRepository.findUserByEmail(email)
	if (existingEmail) {
		const error = new Error('Email already in use')
		error.statusCode = 400
		throw error
	}

	const existingUsername = await authRepository.findUserByUsername(username)
	if (existingUsername) {
		const error = new Error('Username already in use')
		error.statusCode = 400
		throw error
	}

	const hashedPassword = await bcrypt.hash(password, 10)
	const user = await authRepository.createUser({
		username,
		email,
		password: hashedPassword,
		role,
	})

	return sanitizeUser(user)
}

const login = async ({ email, password }) => {
	const user = await authRepository.findUserByEmail(email)
	if (!user) {
		const error = new Error('Invalid email or password')
		error.statusCode = 400
		throw error
	}

	const isValid = await bcrypt.compare(password, user.password)
	if (!isValid) {
		const error = new Error('Invalid email or password')
		error.statusCode = 400
		throw error
	}

	const token = jwt.sign(
		{
			id: user._id,
			email: user.email,
			role: user.role,
		},
		getJwtSecret(),
		{ expiresIn: getJwtExpiry() },
	)

	return {
		token,
		user: sanitizeUser(user),
	}
}

const getProfile = async (userId) => {
	const user = await authRepository.findUserById(userId)
	if (!user) {
		const error = new Error('User not found')
		error.statusCode = 404
		throw error
	}

	return user
}

module.exports = {
	register,
	login,
	getProfile,
}
