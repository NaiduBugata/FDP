const scheduleRepository = require('../repositories/schedule.repository')

const getAll = () => scheduleRepository.getAll()
const getById = async (id) => {
	const item = await scheduleRepository.getById(id)
	if (!item) {
		const error = new Error('Schedule item not found')
		error.statusCode = 404
		throw error
	}
	return item
}
const create = (payload) => scheduleRepository.create(payload)
const updateById = async (id, payload) => {
	const updated = await scheduleRepository.updateById(id, payload)
	if (!updated) {
		const error = new Error('Schedule item not found')
		error.statusCode = 404
		throw error
	}
	return updated
}
const removeById = async (id) => {
	const removed = await scheduleRepository.removeById(id)
	if (!removed) {
		const error = new Error('Schedule item not found')
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
