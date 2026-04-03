const ExcelJS = require('exceljs')
const participantsService = require('../services/participants.service')

const getCombined = async (req, res, next) => {
	try {
		const data = await participantsService.getCombined()
		return res.status(200).json({ message: 'Participants fetched successfully', data })
	} catch (error) {
		return next(error)
	}
}

const exportCombinedExcel = async (req, res, next) => {
	try {
		const participants = await participantsService.getCombined()

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Participants')

		worksheet.columns = [
			{ header: 'Name', key: 'fullName', width: 24 },
			{ header: 'Mobile', key: 'mobileNumber', width: 18 },
			{ header: 'Email', key: 'emailId', width: 28 },
			{ header: 'Designation', key: 'designation', width: 24 },
			{ header: 'Institution', key: 'institution', width: 30 },
			{ header: 'Participant Type', key: 'participantType', width: 18 },
			{ header: 'Mode', key: 'mode', width: 12 },
			{ header: 'Declaration', key: 'declaration', width: 14 },
			{ header: 'Signature', key: 'signature', width: 20 },
			{ header: 'Submitted At', key: 'submittedAt', width: 24 },
		]

		const headerRow = worksheet.getRow(1)
		headerRow.font = { bold: true }
		headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
		headerRow.height = 22

		participants.forEach((item) => {
			const row = worksheet.addRow({
				fullName: item.fullName || '',
				mobileNumber: item.mobileNumber || '',
				emailId: item.emailId || '',
				designation: item.designation || '',
				institution: item.institution || '',
				participantType: item.participantType || '',
				mode: item.mode || '',
				declaration: item.declaration || '',
				signature: item.signature || '',
				submittedAt: item.createdAt ? new Date(item.createdAt).toISOString() : '',
			})
			row.alignment = { vertical: 'middle', wrapText: true }
		})

		const fileBuffer = await workbook.xlsx.writeBuffer()
		const datePart = new Date().toISOString().slice(0, 10)
		const fileName = `participants-combined-${datePart}.xlsx`

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
	getCombined,
	exportCombinedExcel,
}
