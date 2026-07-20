const Registration = require('../models/registration.model')

const getAll = () => Registration.find().sort({ createdAt: -1 })
const getById = (id) => Registration.findById(id)
const create = (payload) => Registration.create(payload)
const updateById = (id, payload) =>
	Registration.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
const removeById = (id) => Registration.findByIdAndDelete(id)

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	removeById,
}
