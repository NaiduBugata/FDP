const navbarRepository = require('../repositories/navbar.repository')

const getAll = () => navbarRepository.getAll()
const getById = async (id) => {
	const item = await navbarRepository.getById(id)
	if (!item) {
		const error = new Error('Navbar item not found')
		error.statusCode = 404
		throw error
	}
	return item
}
const create = (payload) => navbarRepository.create(payload)
const updateById = async (id, payload) => {
	const updated = await navbarRepository.updateById(id, payload)
	if (!updated) {
		const error = new Error('Navbar item not found')
		error.statusCode = 404
		throw error
	}
	return updated
}
const removeById = async (id) => {
	const removed = await navbarRepository.removeById(id)
	if (!removed) {
		const error = new Error('Navbar item not found')
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
