const { validationResult } = require('express-validator')
const sectionService = require('../services/section.service')

const getAll = async (req, res, next) => {
	try {
		const data = await sectionService.getAll()
		return res.status(200).json({ message: 'Sections fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const getById = async (req, res, next) => {
	try {
		const data = await sectionService.getById(req.params.id)
		return res.status(200).json({ message: 'Section fetched successfully', data })
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

		const data = await sectionService.create(req.body)
		return res.status(201).json({ message: 'Section created successfully', data })
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

		const data = await sectionService.updateById(req.params.id, req.body)
		return res.status(200).json({ message: 'Section updated successfully', data })
	} catch (error) {
		return next(error)
	}
}

const removeById = async (req, res, next) => {
	try {
		const data = await sectionService.removeById(req.params.id)
		return res.status(200).json({ message: 'Section deleted successfully', data })
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
