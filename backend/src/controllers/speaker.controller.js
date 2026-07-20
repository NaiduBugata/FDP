const { validationResult } = require('express-validator')
const speakerService = require('../services/speaker.service')

const getAll = async (req, res, next) => {
	try {
		const data = await speakerService.getAll()
		return res.status(200).json({ message: 'Speakers fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const getById = async (req, res, next) => {
	try {
		const data = await speakerService.getById(req.params.id)
		return res.status(200).json({ message: 'Speaker fetched successfully', data })
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

		const data = await speakerService.create(req.body)
		return res.status(201).json({ message: 'Speaker created successfully', data })
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

		const data = await speakerService.updateById(req.params.id, req.body)
		return res.status(200).json({ message: 'Speaker updated successfully', data })
	} catch (error) {
		return next(error)
	}
}

const removeById = async (req, res, next) => {
	try {
		const data = await speakerService.removeById(req.params.id)
		return res.status(200).json({ message: 'Speaker deleted successfully', data })
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
