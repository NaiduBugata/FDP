const { validationResult } = require('express-validator')
const ExcelJS = require('exceljs')
const registrationService = require('../services/registration.service')

const normalizeScope = (value = '') => {
	const scope = String(value || '')
		.trim()
		.toLowerCase()
	if (!scope || scope === 'all') {
		return 'all'
	}
	if (scope === 'internal' || scope === 'external') {
		return scope
	}
	return 'all'
}

const applyScopeFilter = (items = [], scope = 'all') => {
	if (!Array.isArray(items) || items.length === 0) {
		return []
	}

	if (scope === 'all') {
		return items
	}

	return items.filter((item) => {
		const participantType = String(item?.participantType || '').toLowerCase()
		if (scope === 'internal') {
			return participantType.includes('internal')
		}
		return participantType.includes('external')
	})
}

const getAll = async (req, res, next) => {
	try {
		const scope = normalizeScope(req.query.scope)
		const data = applyScopeFilter(await registrationService.getAll(), scope)
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

const exportExcel = async (req, res, next) => {
	try {
		const scope = normalizeScope(req.query.scope)
		const registrations = applyScopeFilter(await registrationService.getAll(), scope)
		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Registrations')

		worksheet.columns = [
			{ header: 'Name', key: 'fullName', width: 24 },
			{ header: 'Mobile', key: 'mobileNumber', width: 18 },
			{ header: 'Email', key: 'emailId', width: 28 },
			{ header: 'Designation', key: 'designation', width: 24 },
			{ header: 'Institution', key: 'institution', width: 30 },
			{ header: 'Participant Type', key: 'participantType', width: 28 },
			{ header: 'Mode', key: 'mode', width: 12 },
			{ header: 'APAAR Id', key: 'apaarId', width: 20 },
			{ header: 'Declaration', key: 'declaration', width: 14 },
			{ header: 'Submitted At', key: 'submittedAt', width: 24 },
		]

		const headerRow = worksheet.getRow(1)
		headerRow.font = { bold: true }
		headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
		headerRow.height = 24

		registrations.forEach((item) => {
			const row = worksheet.addRow({
				fullName: item.fullName || '',
				mobileNumber: item.mobileNumber || '',
				emailId: item.emailId || '',
				designation: item.designation || '',
				institution: item.institution || '',
				participantType: item.participantType || '',
				mode: item.mode || '',
				apaarId: item.apaarId || '',
				declaration: item.declaration || '',
				submittedAt: item.createdAt ? new Date(item.createdAt).toISOString() : '',
			})

			row.alignment = { vertical: 'middle', wrapText: true }
		})

		const fileBuffer = await workbook.xlsx.writeBuffer()

		const datePart = new Date().toISOString().slice(0, 10)
		const scopePart = scope === 'all' ? 'all' : scope
		const fileName = `new-registrations-${scopePart}-${datePart}.xlsx`

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		)
		res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
		return res.status(200).send(fileBuffer)
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
	exportExcel,
}
