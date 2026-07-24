const express = require('express')
const { body, validationResult } = require('express-validator')

const siteSettingsController = require('../controllers/siteSettings.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')
const superadminMiddleware = require('../middlewares/superadmin.middleware')

const router = express.Router()

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	return next()
}

router.get('/', siteSettingsController.getSettings)

router.put(
	'/',
	[
		authMiddleware,
		adminMiddleware,
		superadminMiddleware,
		body('whatsappJoinLink').optional().trim().isLength({ max: 500 }),
		body('whatsappJoinQr').optional().isString(),
		body('meetingLink').optional().trim().isLength({ max: 500 }),
		body('meetingId').optional().trim().isLength({ max: 200 }),
		body('meetingPassword').optional().trim().isLength({ max: 200 }),
	],
	validateRequest,
	siteSettingsController.updateSettings,
)

module.exports = router
