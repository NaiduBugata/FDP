const User = require('../models/user.model')

const createUser = (payload) => User.create(payload)
const findUserByEmail = (email) => User.findOne({ email })
const findUserByUsername = (username) => User.findOne({ username })
const findUserById = (id) => User.findById(id).select('-password')

module.exports = {
	createUser,
	findUserByEmail,
	findUserByUsername,
	findUserById,
}
