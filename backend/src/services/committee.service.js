const committeeRepository = require('../repositories/committee.repository')

const getAll = () => committeeRepository.getAll()
const getById = async (id) => {
	const item = await committeeRepository.getById(id)
	if (!item) {
		const error = new Error('Committee item not found')
		error.statusCode = 404
		throw error
	}
	return item
}
const create = (payload) => committeeRepository.create(payload)
const updateById = async (id, payload) => {
	const updated = await committeeRepository.updateById(id, payload)
	if (!updated) {
		const error = new Error('Committee item not found')
		error.statusCode = 404
		throw error
	}
	return updated
}
const removeById = async (id) => {
	const removed = await committeeRepository.removeById(id)
	if (!removed) {
		const error = new Error('Committee item not found')
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
