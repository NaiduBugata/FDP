const normalizeInstitutionKey = (value = '') =>
	String(value || '')
		.toLowerCase()
		.replace(/[''`´]/g, '')
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

const EXCLUDED_HOST_INSTITUTION_LABELS = [
	"Vignan's Foundation for Science, Technology & Research",
	"Vignan's Foundation for Science, Technology and Research",
	'Vignan Foundation for Science, Technology & Research',
	'Vignan Foundation for Science, Technology and Research',
	"Vignan's Foundation for Science Technology & Research",
	"Vignan's Foundation for Science Technology and Research",
	'VFSTR',
	'VFSTR University',
	'VFSTR Deemed to be University',
	'VFSTR (Deemed to be University)',
	"Vignan's Foundation for Science, Technology & Research (Deemed to be University)",
	"Vignan's Foundation for Science, Technology and Research (Deemed to be University)",
	"Vignan's Foundation for Science, Technology & Research, Vadlamudi",
	"Vignan's Foundation for Science, Technology & Research, Guntur",
	"Vignan's Foundation for Science, Technology & Research, Andhra Pradesh",
	"Vignan's Foundation for Science, Technology & Research University",
	'Vignan University',
	"Vignan's University",
	'Vignan University, Guntur',
	'Vignan University, Vadlamudi',
	'Vignan Deemed University',
	'Vignan Deemed-to-be University',
	'VU',
	'VIGNAN',
	'Vignan',
	'Vignan Univ',
	'VFSTR Guntur',
	'VFSTR Andhra Pradesh',
	'VFSTR AP',
	'Vignan University AP',
	'Vignan University Andhra Pradesh',
	'Vignan University Guntur',
	'Vignan University Vadlamudi',
	"Vignan's University Guntur",
	'Vignan University (VFSTR)',
	'VFSTR Vadlamudi',
]

const EXCLUDED_HOST_KEYS = new Set(
	EXCLUDED_HOST_INSTITUTION_LABELS.map((label) => normalizeInstitutionKey(label)).filter(Boolean),
)

const isHostInstitution = (value = '') => {
	const key = normalizeInstitutionKey(value)
	if (!key) {
		return false
	}

	if (EXCLUDED_HOST_KEYS.has(key)) {
		return true
	}

	if (key === 'vu' || key === 'vignan' || key === 'vfstr' || key === 'vignans') {
		return true
	}

	if (/\bvfstr\b/.test(key)) {
		return true
	}

	if (/\bvignan/.test(key) && /\bfoundation\b/.test(key) && /\bscience\b/.test(key)) {
		return true
	}

	if (
		/\bvignan/.test(key) &&
		/\b(university|univ|deemed|guntur|vadlamudi|andhra|ap)\b/.test(key)
	) {
		return true
	}

	return false
}

const filterHostInstitutionRegistrations = (registrations = [], mode = '') => {
	const normalizedMode = String(mode || '')
		.trim()
		.toLowerCase()

	return registrations.filter((item) => {
		const email = String(item?.emailId || item?.email || '')
			.trim()
			.toLowerCase()
		const isVignanEmail =
			email.endsWith('@vignan.ac.in') ||
			email.endsWith('@vignanuniversity.in') ||
			email.endsWith('@vignanuniversity.com')

		if (!isHostInstitution(item?.institution) && !isVignanEmail) {
			return false
		}
		if (!normalizedMode) {
			return true
		}
		return String(item?.mode || '').trim().toLowerCase() === normalizedMode
	})
}

const isVignanEmailAddress = (value = '') => {
	const email = String(value || '')
		.trim()
		.toLowerCase()
	return (
		email.endsWith('@vignan.ac.in') ||
		email.endsWith('@vignanuniversity.in') ||
		email.endsWith('@vignanuniversity.com')
	)
}

const filterOtherCollegeRegistrations = (registrations = [], mode = '') => {
	const normalizedMode = String(mode || '')
		.trim()
		.toLowerCase()

	return registrations.filter((item) => {
		if (isHostInstitution(item?.institution) || isVignanEmailAddress(item?.emailId || item?.email)) {
			return false
		}
		if (!normalizedMode) {
			return true
		}
		return String(item?.mode || '').trim().toLowerCase() === normalizedMode
	})
}

const collectUniqueExternalColleges = (registrations = []) => {
	const byKey = new Map()

	registrations.forEach((item) => {
		const raw = String(item?.institution || '').trim()
		if (!raw || isHostInstitution(raw)) {
			return
		}

		const key = normalizeInstitutionKey(raw)
		if (!key) {
			return
		}

		const existing = byKey.get(key)
		if (!existing || raw.length > existing.length) {
			byKey.set(key, raw)
		}
	})

	return [...byKey.values()].sort((left, right) =>
		left.localeCompare(right, undefined, { sensitivity: 'base' }),
	)
}

module.exports = {
	normalizeInstitutionKey,
	isHostInstitution,
	filterHostInstitutionRegistrations,
	filterOtherCollegeRegistrations,
	collectUniqueExternalColleges,
}
