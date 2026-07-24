const { validationResult } = require('express-validator')
const ExcelJS = require('exceljs')
const registrationService = require('../services/registration.service')
const {
	collectUniqueExternalColleges,
	filterHostInstitutionRegistrations,
} = require('../utils/institution.utils')

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

const normalizeMode = (value = '') => {
	const mode = String(value || '')
		.trim()
		.toLowerCase()
	if (mode === 'online') {
		return 'Online'
	}
	if (mode === 'offline') {
		return 'Offline'
	}
	return ''
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

const applyModeFilter = (items = [], mode = '') => {
	if (!mode) {
		return items
	}

	return items.filter(
		(item) => String(item?.mode || '').trim().toLowerCase() === mode.toLowerCase(),
	)
}

const sortBySubmittedAt = (items = []) =>
	[...items].sort((left, right) => {
		const leftTime = left?.createdAt ? new Date(left.createdAt).getTime() : 0
		const rightTime = right?.createdAt ? new Date(right.createdAt).getTime() : 0
		return leftTime - rightTime
	})

const getAll = async (req, res, next) => {
	try {
		const scope = normalizeScope(req.query.scope)
		const mode = normalizeMode(req.query.mode)
		const data = sortBySubmittedAt(
			applyModeFilter(applyScopeFilter(await registrationService.getAll(), scope), mode),
		)
		return res.status(200).json({
			message: 'Registrations fetched successfully',
			data,
			meta: {
				count: data.length,
				mode: mode || 'all',
				scope,
			},
		})
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
		const mode = normalizeMode(req.query.mode)
		const registrations = sortBySubmittedAt(
			applyModeFilter(applyScopeFilter(await registrationService.getAll(), scope), mode),
		)
		const totalCount = registrations.length
		const modeLabel = mode || 'All'
		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Registrations')

		worksheet.mergeCells('A1:K1')
		const summaryCell = worksheet.getCell('A1')
		summaryCell.value = `Mode: ${modeLabel} | Total Count: ${totalCount} | Sorted by Submitted At (oldest first)`
		summaryCell.font = { bold: true, size: 12 }
		summaryCell.alignment = { vertical: 'middle', horizontal: 'left' }
		worksheet.getRow(1).height = 26

		worksheet.getRow(2).values = [
			undefined,
			'S.No',
			'Name',
			'Mobile',
			'Email',
			'Designation',
			'Institution',
			'Participant Type',
			'Mode',
			'APAAR Id',
			'Declaration',
			'Submitted At',
		]

		const headerRow = worksheet.getRow(2)
		headerRow.font = { bold: true }
		headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
		headerRow.height = 24

		worksheet.columns = [
			{ key: 'serialNo', width: 8 },
			{ key: 'fullName', width: 24 },
			{ key: 'mobileNumber', width: 18 },
			{ key: 'emailId', width: 28 },
			{ key: 'designation', width: 24 },
			{ key: 'institution', width: 30 },
			{ key: 'participantType', width: 28 },
			{ key: 'mode', width: 12 },
			{ key: 'apaarId', width: 20 },
			{ key: 'declaration', width: 14 },
			{ key: 'submittedAt', width: 24 },
		]

		registrations.forEach((item, index) => {
			const row = worksheet.addRow({
				serialNo: index + 1,
				fullName: item.fullName || '',
				mobileNumber: item.mobileNumber || '',
				emailId: item.emailId || '',
				designation: item.designation || '',
				institution: item.institution || '',
				participantType: item.participantType || '',
				mode: item.mode || '',
				apaarId: item.apaarId || '',
				declaration: item.declaration || '',
				submittedAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
			})

			row.alignment = { vertical: 'middle', wrapText: true }
			row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }
		})

		worksheet.addRow([])
		const countLabelRow = worksheet.addRow({
			serialNo: '',
			fullName: `Total Count: ${totalCount}`,
		})
		countLabelRow.getCell(2).font = { bold: true, size: 12 }

		const fileBuffer = await workbook.xlsx.writeBuffer()

		const datePart = new Date().toISOString().slice(0, 10)
		const modeLabel = mode === 'Online' ? 'Online' : mode === 'Offline' ? 'Offline' : 'All'
		const fileName = `QuBioDL-Registrations-${modeLabel}-${totalCount}-${datePart}.xlsx`

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

const exportCollegesExcel = async (req, res, next) => {
	try {
		const registrations = await registrationService.getAll()
		const colleges = collectUniqueExternalColleges(registrations)
		const totalCount = colleges.length
		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Colleges')

		worksheet.mergeCells('A1:B1')
		const summaryCell = worksheet.getCell('A1')
		summaryCell.value = `Unique Colleges (excluding VFSTR/Vignan variants) | Total Count: ${totalCount} | Alphabetical`
		summaryCell.font = { bold: true, size: 12 }
		summaryCell.alignment = { vertical: 'middle', horizontal: 'left' }
		worksheet.getRow(1).height = 26

		worksheet.getRow(2).values = [undefined, 'S.No', 'College / Institution']
		const headerRow = worksheet.getRow(2)
		headerRow.font = { bold: true }
		headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
		headerRow.height = 24

		worksheet.columns = [
			{ key: 'serialNo', width: 8 },
			{ key: 'institution', width: 60 },
		]

		colleges.forEach((institution, index) => {
			const row = worksheet.addRow({
				serialNo: index + 1,
				institution,
			})
			row.alignment = { vertical: 'middle', wrapText: true }
			row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }
		})

		worksheet.addRow([])
		const countLabelRow = worksheet.addRow({
			serialNo: '',
			institution: `Total Count: ${totalCount}`,
		})
		countLabelRow.getCell(2).font = { bold: true, size: 12 }

		const fileBuffer = await workbook.xlsx.writeBuffer()
		const datePart = new Date().toISOString().slice(0, 10)
		const fileName = `QuBioDL-Unique-Colleges-${totalCount}-${datePart}.xlsx`

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

const exportVfstrOnlineExcel = async (req, res, next) => {
	try {
		const registrations = sortBySubmittedAt(
			filterHostInstitutionRegistrations(await registrationService.getAll(), 'Online'),
		)
		return sendVfstrRegistrationsExcel(res, {
			registrations,
			sheetName: 'VFSTR Online',
			summaryLabel: 'VFSTR / Vignan Online Participants',
			filePrefix: 'QuBioDL-VFSTR-Online',
		})
	} catch (error) {
		return next(error)
	}
}

const exportVfstrOfflineExcel = async (req, res, next) => {
	try {
		const registrations = sortBySubmittedAt(
			filterHostInstitutionRegistrations(await registrationService.getAll(), 'Offline'),
		)
		return sendVfstrRegistrationsExcel(res, {
			registrations,
			sheetName: 'VFSTR Offline',
			summaryLabel: 'VFSTR / Vignan Offline Participants',
			filePrefix: 'QuBioDL-VFSTR-Offline',
		})
	} catch (error) {
		return next(error)
	}
}

const exportVfstrAllExcel = async (req, res, next) => {
	try {
		const registrations = sortBySubmittedAt(
			filterHostInstitutionRegistrations(await registrationService.getAll(), ''),
		)
		return sendVfstrRegistrationsExcel(res, {
			registrations,
			sheetName: 'VFSTR All',
			summaryLabel: 'VFSTR / Vignan All Participants (Online + Offline)',
			filePrefix: 'QuBioDL-VFSTR-All',
		})
	} catch (error) {
		return next(error)
	}
}

const sendVfstrRegistrationsExcel = async (
	res,
	{ registrations, sheetName, summaryLabel, filePrefix },
) => {
	const totalCount = registrations.length
	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet(sheetName)

	worksheet.mergeCells('A1:K1')
	const summaryCell = worksheet.getCell('A1')
	summaryCell.value = `${summaryLabel} | Total Count: ${totalCount} | Sorted by Submitted At (oldest first)`
	summaryCell.font = { bold: true, size: 12 }
	summaryCell.alignment = { vertical: 'middle', horizontal: 'left' }
	worksheet.getRow(1).height = 26

	worksheet.getRow(2).values = [
		undefined,
		'S.No',
		'Name',
		'Mobile',
		'Email',
		'Designation',
		'Institution',
		'Participant Type',
		'Mode',
		'APAAR Id',
		'Declaration',
		'Submitted At',
	]

	const headerRow = worksheet.getRow(2)
	headerRow.font = { bold: true }
	headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
	headerRow.height = 24

	worksheet.columns = [
		{ key: 'serialNo', width: 8 },
		{ key: 'fullName', width: 24 },
		{ key: 'mobileNumber', width: 18 },
		{ key: 'emailId', width: 28 },
		{ key: 'designation', width: 24 },
		{ key: 'institution', width: 36 },
		{ key: 'participantType', width: 28 },
		{ key: 'mode', width: 12 },
		{ key: 'apaarId', width: 20 },
		{ key: 'declaration', width: 14 },
		{ key: 'submittedAt', width: 24 },
	]

	registrations.forEach((item, index) => {
		const row = worksheet.addRow({
			serialNo: index + 1,
			fullName: item.fullName || '',
			mobileNumber: item.mobileNumber || '',
			emailId: item.emailId || '',
			designation: item.designation || '',
			institution: item.institution || '',
			participantType: item.participantType || '',
			mode: item.mode || '',
			apaarId: item.apaarId || '',
			declaration: item.declaration || '',
			submittedAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
		})

		row.alignment = { vertical: 'middle', wrapText: true }
		row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }
	})

	worksheet.addRow([])
	const countLabelRow = worksheet.addRow({
		serialNo: '',
		fullName: `Total Count: ${totalCount}`,
	})
	countLabelRow.getCell(2).font = { bold: true, size: 12 }

	const fileBuffer = await workbook.xlsx.writeBuffer()
	const datePart = new Date().toISOString().slice(0, 10)
	const fileName = `${filePrefix}-${totalCount}-${datePart}.xlsx`

	res.setHeader(
		'Content-Type',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	)
	res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
	return res.status(200).send(fileBuffer)
}

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	removeById,
	exportExcel,
	exportCollegesExcel,
	exportVfstrOnlineExcel,
	exportVfstrOfflineExcel,
	exportVfstrAllExcel,
}
