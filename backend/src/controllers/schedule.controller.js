const { validationResult } = require('express-validator')
const scheduleService = require('../services/schedule.service')

const getAll = async (req, res, next) => {
	try {
		const data = await scheduleService.getAll()
		return res.status(200).json({ message: 'Schedule items fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const getById = async (req, res, next) => {
	try {
		const data = await scheduleService.getById(req.params.id)
		return res.status(200).json({ message: 'Schedule item fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const create = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const data = await scheduleService.create(req.body)
		return res.status(201).json({ message: 'Schedule item created successfully', data })
	} catch (error) {
		return next(error)
	}
}

const updateById = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const data = await scheduleService.updateById(req.params.id, req.body)
		return res.status(200).json({ message: 'Schedule item updated successfully', data })
	} catch (error) {
		return next(error)
	}
}

const removeById = async (req, res, next) => {
	try {
		const data = await scheduleService.removeById(req.params.id)
		return res.status(200).json({ message: 'Schedule item deleted successfully', data })
	} catch (error) {
		return next(error)
	}
}

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	removeById,
}
