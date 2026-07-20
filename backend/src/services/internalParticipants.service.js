const internalParticipantsRepository = require('../repositories/internalParticipants.repository')

const normalizeHeader = (value = '') =>
	String(value || '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '')

const resolveColumnIndex = (headers = [], candidates = []) => {
	if (!Array.isArray(headers) || headers.length === 0) {
		return -1
	}

	const normalizedHeaders = headers.map((header) => normalizeHeader(header))
	for (const candidate of candidates) {
		const normalizedCandidate = normalizeHeader(candidate)
		const index = normalizedHeaders.indexOf(normalizedCandidate)
		if (index >= 0) {
			return index
		}
	}

	return -1
}

const getCellText = (doc, index) => {
	if (!doc || index < 0) {
		return ''
	}

	if (Array.isArray(doc.valuesText) && doc.valuesText[index] != null) {
		return String(doc.valuesText[index] ?? '').trim()
	}

	if (Array.isArray(doc.valuesRaw) && doc.valuesRaw[index] != null) {
		return String(doc.valuesRaw[index] ?? '').trim()
	}

	return ''
}

const mapInternalParticipant = (doc) => {
	const headers = Array.isArray(doc?.headers) ? doc.headers : []

	const serialIndex = resolveColumnIndex(headers, ['S.No', 'S. No.', 'SNo', 'Serial No', 'SerialNo'])
	const empCodeIndex = resolveColumnIndex(headers, ['Emp.Code', 'Emp Code', 'EmpCode', 'Employee Code'])
	const nameIndex = resolveColumnIndex(headers, ['Name of the Faculty', 'Name', 'Faculty Name'])
	const designationIndex = resolveColumnIndex(headers, ['Designation'])
	const mobileIndex = resolveColumnIndex(headers, ['Mobile No', 'Mobile', 'Mobile Number', 'MobileNo'])
	const emailIndex = resolveColumnIndex(headers, ['University mail id', 'Email', 'Email Id', 'Mail Id'])

	return {
		_id: doc?._id,
		serialNo: getCellText(doc, serialIndex),
		empCode: getCellText(doc, empCodeIndex),
		name: getCellText(doc, nameIndex),
		designation: getCellText(doc, designationIndex),
		mobile: getCellText(doc, mobileIndex),
		email: getCellText(doc, emailIndex),
		sourceFile: doc?.sourceFile || '',
		sheetName: doc?.sheetName || '',
		rowNumber: doc?.rowNumber || null,
	}
}

const getAll = async () => {
	const rawDocs = await internalParticipantsRepository.getAllRaw()
	return rawDocs.map(mapInternalParticipant)
}

module.exports = {
	getAll,
	mapInternalParticipant,
}
