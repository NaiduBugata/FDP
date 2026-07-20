const Speaker = require('../models/speaker.model')

const getAll = () => Speaker.find().sort({ createdAt: -1 })
const getById = (id) => Speaker.findById(id)
const create = (payload) => Speaker.create(payload)
const updateById = (id, payload) =>
	Speaker.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
const removeById = (id) => Speaker.findByIdAndDelete(id)

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	removeById,
}
