const { validationResult } = require('express-validator')
const committeeService = require('../services/committee.service')

const getAll = async (req, res, next) => {
	try {
		const data = await committeeService.getAll()
		return res.status(200).json({ message: 'Committee items fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const getById = async (req, res, next) => {
	try {
		const data = await committeeService.getById(req.params.id)
		return res.status(200).json({ message: 'Committee item fetched successfully', data })
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

		const data = await committeeService.create(req.body)
		return res.status(201).json({ message: 'Committee item created successfully', data })
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

		const data = await committeeService.updateById(req.params.id, req.body)
		return res.status(200).json({ message: 'Committee item updated successfully', data })
	} catch (error) {
		return next(error)
	}
}

const removeById = async (req, res, next) => {
	try {
		const data = await committeeService.removeById(req.params.id)
		return res.status(200).json({ message: 'Committee item deleted successfully', data })
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
