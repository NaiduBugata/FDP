const registrationService = require('./registration.service')
const internalParticipantsService = require('./internalParticipants.service')
const externalParticipantsService = require('./externalParticipants.service')

const normalizeText = (value) => String(value ?? '').trim()

const mapInternalToCombined = (item) => ({
	_id: `internal:${item?._id}`,
	fullName: normalizeText(item?.name),
	mobileNumber: normalizeText(item?.mobile),
	emailId: normalizeText(item?.email),
	designation: normalizeText(item?.designation),
	institution: '',
	participantType: 'Internal',
	mode: '',
	declaration: '',
	signature: '',
	createdAt: null,
	_source: 'internal_excel',
	_sortKey: Number(item?.rowNumber) || 0,
})

const mapExternalToCombined = (item) => ({
	_id: `external:${item?._id}`,
	fullName: normalizeText(item?.name),
	mobileNumber: normalizeText(item?.contact),
	emailId: normalizeText(item?.email),
	designation: '',
	institution: normalizeText(item?.institution),
	participantType: 'External',
	mode: '',
	declaration: '',
	signature: '',
	createdAt: null,
	_source: 'external_excel',
	_sortKey: Number(item?.rowNumber) || 0,
})

const mapRegistrationToCombined = (item) => ({
	...item,
	_id: String(item?._id ?? ''),
	_source: 'registration',
	_sortKey: item?.createdAt ? new Date(item.createdAt).getTime() : 0,
})

const getCombined = async () => {
	const [registrations, internal, external] = await Promise.all([
		registrationService.getAll(),
		internalParticipantsService.getAll(),
		externalParticipantsService.getAll(),
	])

	const combined = [
		...registrations.map(mapRegistrationToCombined),
		...internal.map(mapInternalToCombined),
		...external.map(mapExternalToCombined),
	]

	// registrations first (desc by createdAt), then internal/external (asc by rowNumber)
	combined.sort((a, b) => {
		if (a._source === b._source) {
			if (a._source === 'registration') {
				return (b._sortKey || 0) - (a._sortKey || 0)
			}
			return (a._sortKey || 0) - (b._sortKey || 0)
		}
		if (a._source === 'registration') return -1
		if (b._source === 'registration') return 1
		if (a._source === 'internal_excel' && b._source === 'external_excel') return -1
		if (a._source === 'external_excel' && b._source === 'internal_excel') return 1
		return 0
	})

	return combined.map(({ _sortKey, ...rest }) => rest)
}

module.exports = {
	getCombined,
}
