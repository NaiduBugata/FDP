const mailService = require('../services/mail.service')

const sendTest = async (req, res, next) => {
	try {
		if (!mailService.isEmailEnabled()) {
			return res.status(400).json({
				message: 'Email sending is disabled. Set EMAIL_ENABLED=true on the server.',
			})
		}

		const results = await mailService.sendTestRegistrationEmails()
		const successCount = results.filter((item) => item.ok).length
		const failCount = results.length - successCount

		return res.status(200).json({
			message:
				failCount === 0
					? `Test emails sent successfully to ${successCount} recipient(s).`
					: `Sent ${successCount} email(s); ${failCount} failed.`,
			data: {
				recipients: mailService.TEST_RECIPIENTS,
				results,
			},
		})
	} catch (error) {
		return next(error)
	}
}

module.exports = {
	sendTest,
}
