const ExcelJS = require('exceljs')
const internalParticipantsService = require('../services/internalParticipants.service')

const getAll = async (req, res, next) => {
	try {
		const data = await internalParticipantsService.getAll()
		return res.status(200).json({ message: 'Internal participants fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const exportExcel = async (req, res, next) => {
	try {
		const participants = await internalParticipantsService.getAll()

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Internal Participants')

		worksheet.columns = [
			{ header: 'S.No', key: 'serialNo', width: 10 },
			{ header: 'Emp.Code', key: 'empCode', width: 16 },
			{ header: 'Name of the Faculty', key: 'name', width: 28 },
			{ header: 'Designation', key: 'designation', width: 22 },
			{ header: 'Mobile No', key: 'mobile', width: 18 },
			{ header: 'University mail id', key: 'email', width: 30 },
		]

		const headerRow = worksheet.getRow(1)
		headerRow.font = { bold: true }
		headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
		headerRow.height = 22

		participants.forEach((item) => {
			const row = worksheet.addRow({
				serialNo: item.serialNo || '',
				empCode: item.empCode || '',
				name: item.name || '',
				designation: item.designation || '',
				mobile: item.mobile || '',
				email: item.email || '',
			})
			row.alignment = { vertical: 'middle', wrapText: true }
		})

		const fileBuffer = await workbook.xlsx.writeBuffer()
		const datePart = new Date().toISOString().slice(0, 10)
		const fileName = `internal-participants-${datePart}.xlsx`

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
