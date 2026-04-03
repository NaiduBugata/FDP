const registrationRepository = require('../repositories/registration.repository')

const getAll = () => registrationRepository.getAll()
const getById = async (id) => {
	const item = await registrationRepository.getById(id)
	if (!item) {
		const error = new Error('Registration not found')
		error.statusCode = 404
		throw error
	}
	return item
}
const create = (payload) => registrationRepository.create(payload)
const updateById = async (id, payload) => {
	const updated = await registrationRepository.updateById(id, payload)
	if (!updated) {
		const error = new Error('Registration not found')
		error.statusCode = 404
		throw error
	}
	return updated
}
const removeById = async (id) => {
	const removed = await registrationRepository.removeById(id)
	if (!removed) {
		const error = new Error('Registration not found')
		error.statusCode = 404
		throw error
	}
	return removed
}

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	removeById,
}
