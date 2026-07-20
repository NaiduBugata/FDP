const sectionRepository = require('../repositories/section.repository')

const getAll = () => sectionRepository.getAll()
const getById = async (id) => {
	const item = await sectionRepository.getById(id)
	if (!item) {
		const error = new Error('Section not found')
		error.statusCode = 404
		throw error
	}
	return item
}
const create = (payload) => sectionRepository.create(payload)
const updateById = async (id, payload) => {
	const updated = await sectionRepository.updateById(id, payload)
	if (!updated) {
		const error = new Error('Section not found')
		error.statusCode = 404
		throw error
	}
	return updated
}
const removeById = async (id) => {
	const removed = await sectionRepository.removeById(id)
	if (!removed) {
		const error = new Error('Section not found')
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
