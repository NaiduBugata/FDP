const fs = require('fs')
const path = require('path')
const { Resend } = require('resend')
const nodemailer = require('nodemailer')
const siteSettingsService = require('./siteSettings.service')

const TEMPLATE_PATH = path.resolve(__dirname, '../templates/registration-confirmation.html')
const FALLBACK = 'Will be shared soon'

const getEnv = (key, fallback = '') => {
	const value = process.env[key]
	if (value === undefined || value === null) {
		return fallback
	}
	const trimmed = String(value).trim()
	return trimmed || fallback
}

const isEmailEnabled = () => String(process.env.EMAIL_ENABLED || '').toLowerCase() === 'true'

const escapeHtml = (value = '') =>
	String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')

const renderTemplate = (html, vars = {}) => {
	let output = String(html || '')
	Object.entries(vars).forEach(([key, value]) => {
		const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
		output = output.replace(pattern, String(value ?? ''))
	})
	return output
}

const buildMailContext = (overrides = {}, settings = {}) => {
	const meetingLinkRaw =
		overrides.meetingLink || settings.meetingLink || getEnv('MEETING_LINK', '')
	const website = overrides.website || getEnv('WEBSITE_URL', 'https://fdp-r80r.onrender.com')
	const companyName = overrides.companyName || getEnv('COMPANY_NAME', 'QuBioDL-2K26 / VFSTR CSE')
	const logoUrl = getEnv('LOGO_URL', '')
	const supportPhone = getEnv('SUPPORT_PHONE', '') || FALLBACK

	return {
		participantName: overrides.participantName || 'Participant',
		eventName: overrides.eventName || getEnv('EVENT_NAME', 'QuBioDL 2K26 - Next-Gen Healthcare'),
		eventDate: overrides.eventDate || getEnv('EVENT_DATE', '27th - 31st July 2026'),
		eventTime: overrides.eventTime || getEnv('EVENT_TIME', 'As per program schedule'),
		eventDuration: overrides.eventDuration || getEnv('EVENT_DURATION', '5 days'),
		eventOrganizer: overrides.eventOrganizer || getEnv('EVENT_ORGANIZER', 'Department of CSE, VFSTR'),
		eventVenue: overrides.eventVenue || getEnv('EVENT_VENUE', 'VFSTR, Vadlamudi, Guntur'),
		meetingLink: meetingLinkRaw || FALLBACK,
		meetingLinkHref: meetingLinkRaw || website,
		meetingId:
			overrides.meetingId || settings.meetingId || getEnv('MEETING_ID', '') || FALLBACK,
		meetingPassword:
			overrides.meetingPassword ||
			settings.meetingPassword ||
			getEnv('MEETING_PASSWORD', '') ||
			FALLBACK,
		meetingPlatform:
			overrides.meetingPlatform || getEnv('MEETING_PLATFORM', 'Online (link shared for online sessions)'),
		whatsappLink:
			overrides.whatsappLink ||
			settings.whatsappJoinLink ||
			getEnv('WHATSAPP_LINK', 'https://chat.whatsapp.com/C7OcNsQlZ5n8LMCNucKvkf?s=sw&p=a&ilr=0'),
		website,
		supportEmail: overrides.supportEmail || getEnv('SUPPORT_EMAIL', 'vfstrqubiodl2k26@gmail.com'),
		supportPhone,
		companyName,
		logoUrl,
		year: String(new Date().getFullYear()),
	}
}

const toTemplateVars = (context) => {
	const logoBlock = context.logoUrl
		? `<img src="${escapeHtml(context.logoUrl)}" alt="${escapeHtml(context.companyName)} logo" width="120" style="display:block; margin:0 auto 14px; max-width:120px; height:auto;" />`
		: `<div style="display:inline-block; margin:0 auto 14px; padding:10px 18px; border-radius:10px; background-color:rgba(255,255,255,0.14); color:#FFFFFF; font-size:18px; font-weight:700; letter-spacing:0.04em;">QuBioDL 2K26</div>`

	return {
		participantName: escapeHtml(context.participantName),
		eventName: escapeHtml(context.eventName),
		eventDate: escapeHtml(context.eventDate),
		eventTime: escapeHtml(context.eventTime),
		eventDuration: escapeHtml(context.eventDuration),
		eventOrganizer: escapeHtml(context.eventOrganizer),
		eventVenue: escapeHtml(context.eventVenue),
		meetingLink: escapeHtml(context.meetingLink),
		meetingLinkHref: escapeHtml(context.meetingLinkHref),
		meetingId: escapeHtml(context.meetingId),
		meetingPassword: escapeHtml(context.meetingPassword),
		meetingPlatform: escapeHtml(context.meetingPlatform),
		whatsappLink: escapeHtml(context.whatsappLink),
		website: escapeHtml(context.website),
		supportEmail: escapeHtml(context.supportEmail),
		supportPhone: escapeHtml(context.supportPhone),
		companyName: escapeHtml(context.companyName),
		logoUrl: escapeHtml(context.logoUrl),
		logoBlock,
		year: escapeHtml(context.year),
	}
}

let resendClient = null
let smtpTransporter = null

const getFromAddress = () =>
	getEnv(
		'EMAIL_FROM',
		getEnv('SMTP_FROM', 'QuBioDL-2K26 <beth.t@example.com>'),
	)

const getResendClient = () => {
	const apiKey = getEnv('RESEND_API_KEY')
	if (!apiKey) {
		return null
	}
	if (!resendClient) {
		resendClient = new Resend(apiKey)
	}
	return resendClient
}

const getSmtpTransporter = () => {
	if (smtpTransporter) {
		return smtpTransporter
	}

	const user = getEnv('SMTP_USER')
	const pass = getEnv('SMTP_PASS')
	if (!user || !pass) {
		return null
	}

	smtpTransporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user,
			pass,
		},
	})

	return smtpTransporter
}

const loadTemplate = () => {
	if (!fs.existsSync(TEMPLATE_PATH)) {
		const error = new Error('Registration email template not found')
		error.statusCode = 500
		throw error
	}
	return fs.readFileSync(TEMPLATE_PATH, 'utf8')
}

const sendWithResend = async ({ from, to, subject, html, text }) => {
	const client = getResendClient()
	if (!client) {
		return null
	}

	const { data, error } = await client.emails.send({
		from,
		to: [to],
		subject,
		html,
		text,
	})

	if (error) {
		const err = new Error(error.message || 'Resend email failed')
		err.statusCode = 502
		err.details = error
		throw err
	}

	return {
		provider: 'resend',
		messageId: data?.id || '',
		accepted: [to],
		rejected: [],
	}
}

const sendWithSmtp = async ({ from, to, subject, html, text }) => {
	const transporter = getSmtpTransporter()
	if (!transporter) {
		return null
	}

	const info = await transporter.sendMail({
		from,
		to,
		subject,
		html,
		text,
	})

	return {
		provider: 'smtp',
		messageId: info.messageId,
		accepted: info.accepted,
		rejected: info.rejected,
	}
}

const sendRegistrationConfirmation = async ({ to, participantName, ...rest } = {}) => {
	if (!isEmailEnabled()) {
		return { skipped: true, reason: 'EMAIL_ENABLED is not true' }
	}

	const recipient = String(to || '').trim()
	if (!recipient) {
		const error = new Error('Recipient email is required')
		error.statusCode = 400
		throw error
	}

	if (!getResendClient() && !getSmtpTransporter()) {
		const error = new Error('Email provider is not configured. Set RESEND_API_KEY (preferred) or SMTP credentials.')
		error.statusCode = 500
		throw error
	}

	const settingsDoc = await siteSettingsService.getSettings().catch(() => null)
	const settings = settingsDoc
		? {
				whatsappJoinLink: settingsDoc.whatsappJoinLink,
				meetingLink: settingsDoc.meetingLink,
				meetingId: settingsDoc.meetingId,
				meetingPassword: settingsDoc.meetingPassword,
			}
		: {}

	const context = buildMailContext({ participantName, ...rest }, settings)
	const html = renderTemplate(loadTemplate(), toTemplateVars(context))
	const from = getFromAddress()
	const subject = `Registration Confirmed — ${context.eventName}`
	const text = [
		`Hello ${context.participantName},`,
		'',
		`Thank you for registering for ${context.eventName}.`,
		`Date: ${context.eventDate}`,
		`Time: ${context.eventTime}`,
		`Duration: ${context.eventDuration}`,
		`Meeting: ${context.meetingLink}`,
		`WhatsApp: ${context.whatsappLink}`,
		`Website: ${context.website}`,
		`Support: ${context.supportEmail}`,
	].join('\n')

	const payload = { from, to: recipient, subject, html, text }

	// Prefer Resend for local + production reliability.
	if (getResendClient()) {
		const result = await sendWithResend(payload)
		return { skipped: false, ...result }
	}

	const smtpResult = await sendWithSmtp(payload)
	return { skipped: false, ...smtpResult }
}

const TEST_RECIPIENTS = [
	'231fa04739@vignan.ac.in',
	'231fa04510@vignan.ac.in',
	'drmsb_cse@vignan.ac.in',
	'naidubugata88@gmail.com',
]

const sendTestRegistrationEmails = async () => {
	const results = []
	for (const recipient of TEST_RECIPIENTS) {
		try {
			const result = await sendRegistrationConfirmation({
				to: recipient,
				participantName: 'QuBioDL Test Participant',
			})
			results.push({ recipient, ok: true, ...result })
		} catch (error) {
			results.push({
				recipient,
				ok: false,
				error: error.message || 'Failed to send email',
			})
		}
	}
	return results
}

module.exports = {
	isEmailEnabled,
	sendRegistrationConfirmation,
	sendTestRegistrationEmails,
	TEST_RECIPIENTS,
}
