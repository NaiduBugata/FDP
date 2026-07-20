const Committee = require('../models/committee.model')

const getAll = () => Committee.find().sort({ createdAt: -1 })
const getById = (id) => Committee.findById(id)
const create = (payload) => Committee.create(payload)
const updateById = (id, payload) =>
	Committee.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
const removeById = (id) => Committee.findByIdAndDelete(id)

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	removeById,
}
