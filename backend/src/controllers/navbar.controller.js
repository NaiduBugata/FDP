const { validationResult } = require('express-validator')
const navbarService = require('../services/navbar.service')

const getAll = async (req, res, next) => {
	try {
		const data = await navbarService.getAll()
		return res.status(200).json({ message: 'Navbar items fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const getById = async (req, res, next) => {
	try {
		const data = await navbarService.getById(req.params.id)
		return res.status(200).json({ message: 'Navbar item fetched successfully', data })
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

		const data = await navbarService.create(req.body)
		return res.status(201).json({ message: 'Navbar item created successfully', data })
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

		const data = await navbarService.updateById(req.params.id, req.body)
		return res.status(200).json({ message: 'Navbar item updated successfully', data })
	} catch (error) {
		return next(error)
	}
}

const removeById = async (req, res, next) => {
	try {
		const data = await navbarService.removeById(req.params.id)
		return res.status(200).json({ message: 'Navbar item deleted successfully', data })
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
