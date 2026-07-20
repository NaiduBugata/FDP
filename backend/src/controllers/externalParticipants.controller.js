const ExcelJS = require('exceljs')
const externalParticipantsService = require('../services/externalParticipants.service')

const getAll = async (req, res, next) => {
	try {
		const data = await externalParticipantsService.getAll()
		return res.status(200).json({ message: 'External participants fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const exportExcel = async (req, res, next) => {
	try {
		const participants = await externalParticipantsService.getAll()

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('External Participants')

		worksheet.columns = [
			{ header: 'S. No.', key: 'serialNo', width: 10 },
			{ header: 'Name of Participant', key: 'name', width: 28 },
			{ header: 'Affiliated Department and Institute ', key: 'institution', width: 40 },
			{ header: 'Email Id', key: 'email', width: 28 },
			{ header: 'Contact No (Office & Mobile)', key: 'contact', width: 24 },
		]

		const headerRow = worksheet.getRow(1)
		headerRow.font = { bold: true }
		headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
		headerRow.height = 22

		participants.forEach((item) => {
			const row = worksheet.addRow({
				serialNo: item.serialNo || '',
				name: item.name || '',
				institution: item.institution || '',
				email: item.email || '',
				contact: item.contact || '',
			})
			row.alignment = { vertical: 'middle', wrapText: true }
		})

		const fileBuffer = await workbook.xlsx.writeBuffer()
		const datePart = new Date().toISOString().slice(0, 10)
		const fileName = `external-participants-${datePart}.xlsx`

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
	exportExcel,
}
