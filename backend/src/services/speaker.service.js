const speakerRepository = require('../repositories/speaker.repository')

const getAll = () => speakerRepository.getAll()
const getById = async (id) => {
	const item = await speakerRepository.getById(id)
	if (!item) {
		const error = new Error('Speaker not found')
		error.statusCode = 404
		throw error
	}
	return item
}
const create = (payload) => speakerRepository.create(payload)
const updateById = async (id, payload) => {
	const updated = await speakerRepository.updateById(id, payload)
	if (!updated) {
		const error = new Error('Speaker not found')
		error.statusCode = 404
		throw error
	}
	return updated
}
const removeById = async (id) => {
	const removed = await speakerRepository.removeById(id)
	if (!removed) {
		const error = new Error('Speaker not found')
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
