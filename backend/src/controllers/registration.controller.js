const { validationResult } = require('express-validator')
const registrationService = require('../services/registration.service')

const getAll = async (req, res, next) => {
	try {
		const data = await registrationService.getAll()
		return res.status(200).json({ message: 'Registrations fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const getById = async (req, res, next) => {
	try {
		const data = await registrationService.getById(req.params.id)
		return res.status(200).json({ message: 'Registration fetched successfully', data })
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

		const data = await registrationService.create(req.body)
		return res.status(201).json({ message: 'Registration created successfully', data })
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

		const data = await registrationService.updateById(req.params.id, req.body)
		return res.status(200).json({ message: 'Registration updated successfully', data })
	} catch (error) {
		return next(error)
	}
}

const removeById = async (req, res, next) => {
	try {
		const data = await registrationService.removeById(req.params.id)
		return res.status(200).json({ message: 'Registration deleted successfully', data })
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
