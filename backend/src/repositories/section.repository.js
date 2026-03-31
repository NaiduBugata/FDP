const Section = require('../models/section.model')

const getAll = () => Section.find().sort({ createdAt: -1 })
const getById = (id) => Section.findById(id)
const create = (payload) => Section.create(payload)
const updateById = (id, payload) =>
	Section.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
const removeById = (id) => Section.findByIdAndDelete(id)

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	removeById,
}
