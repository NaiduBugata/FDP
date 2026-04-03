const Schedule = require('../models/schedule.model')

const getAll = () => Schedule.find().sort({ date: 1, createdAt: -1 })
const getById = (id) => Schedule.findById(id)
const create = (payload) => Schedule.create(payload)
const updateById = (id, payload) =>
	Schedule.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
const removeById = (id) => Schedule.findByIdAndDelete(id)

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	removeById,
}
