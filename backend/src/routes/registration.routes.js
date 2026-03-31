const express = require('express')
const { body, param, validationResult } = require('express-validator')

const registrationController = require('../controllers/registration.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

const MAX_PHOTO_BYTES = 3 * 1024 * 1024

const isPassportPhotoWithinLimit = (value = '') => {
	if (!value) {
		return true
	}

	if (typeof value !== 'string') {
		return false
	}

	const match = value.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/)
	if (!match) {
		return false
	}

	const base64Payload = match[1]
	const estimatedBytes = Math.floor((base64Payload.length * 3) / 4)
	return estimatedBytes <= MAX_PHOTO_BYTES
}

const router = express.Router()

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	return next()
}

router.get('/', [authMiddleware, adminMiddleware], registrationController.getAll)
router.get('/export/excel', [authMiddleware, adminMiddleware], registrationController.exportExcel)
router.get(
	'/:id',
	[authMiddleware, adminMiddleware, param('id').isMongoId().withMessage('Invalid ID')],
	validateRequest,
	registrationController.getById,
)
router.post(
	'/',
	[
		body('fullName').trim().notEmpty().withMessage('Full name is required'),
		body('mobileNumber').trim().notEmpty().withMessage('Mobile number is required'),
		body('emailId').isEmail().withMessage('Valid email is required'),
		body('designation').trim().notEmpty().withMessage('Designation is required'),
		body('institution').trim().notEmpty().withMessage('Institution is required'),
		body('participantType').trim().notEmpty().withMessage('Participant type is required'),
		body('mode').isIn(['Online', 'Offline']).withMessage('Mode must be Online or Offline'),
		body('passportPhoto')
			.optional({ checkFalsy: true })
			.custom((value) => isPassportPhotoWithinLimit(value))
			.withMessage('Passport photo must be a valid image and 3MB or smaller'),
		body('declaration').isIn(['Yes', 'No']).withMessage('Declaration must be Yes or No'),
		body('signature').trim().notEmpty().withMessage('Signature is required'),
	],
	validateRequest,
	registrationController.create,
)
router.put(
	'/:id',
	[
		authMiddleware,
		param('id').isMongoId().withMessage('Invalid ID'),
		body('emailId').optional().isEmail().withMessage('Valid email is required'),
		body('mode').optional().isIn(['Online', 'Offline']).withMessage('Mode must be Online or Offline'),
		body('declaration').optional().isIn(['Yes', 'No']).withMessage('Declaration must be Yes or No'),
	],
	validateRequest,
	registrationController.updateById,
)
router.delete(
	'/:id',
	[authMiddleware, param('id').isMongoId().withMessage('Invalid ID')],
	validateRequest,
	registrationController.removeById,
)

module.exports = router
