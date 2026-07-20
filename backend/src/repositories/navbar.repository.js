const Navbar = require('../models/navbar.model')

const getAll = () => Navbar.find().sort({ order: 1, createdAt: -1 })
const getById = (id) => Navbar.findById(id)
const create = (payload) => Navbar.create(payload)
const updateById = (id, payload) =>
	Navbar.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
const removeById = (id) => Navbar.findByIdAndDelete(id)

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	removeById,
}
