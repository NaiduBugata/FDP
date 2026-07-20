const externalParticipantsRepository = require('../repositories/externalParticipants.repository')

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

const mapExternalParticipant = (doc) => {
	const headers = Array.isArray(doc?.headers) ? doc.headers : []

	const serialIndex = resolveColumnIndex(headers, ['S. No.', 'S.No', 'S No', 'S.No.', 'S.No'])
	const nameIndex = resolveColumnIndex(headers, ['Name of Participant', 'Name', 'Participant Name'])
	const instituteIndex = resolveColumnIndex(headers, [
		'Affiliated Department and Institute',
		'Affiliated Department and Institute ',
		'Affiliated Department & Institute',
		'Affiliated Department',
		'Institute',
	])
	const emailIndex = resolveColumnIndex(headers, ['Email Id', 'Email', 'EmailID', 'Email Id.'])
	const contactIndex = resolveColumnIndex(headers, [
		'Contact No (Office & Mobile)',
		'Contact No',
		'Contact Number',
		'Mobile',
	])

	return {
		_id: doc?._id,
		serialNo: getCellText(doc, serialIndex),
		name: getCellText(doc, nameIndex),
		institution: getCellText(doc, instituteIndex),
		email: getCellText(doc, emailIndex),
		contact: getCellText(doc, contactIndex),
		sourceFile: doc?.sourceFile || '',
		sheetName: doc?.sheetName || '',
		rowNumber: doc?.rowNumber || null,
	}
}

const getAll = async () => {
	const rawDocs = await externalParticipantsRepository.getAllRaw()
	return rawDocs.map(mapExternalParticipant)
}

module.exports = {
	getAll,
	mapExternalParticipant,
}
