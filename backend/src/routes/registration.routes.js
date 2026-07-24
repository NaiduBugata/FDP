const express = require('express')
const { body, param, validationResult } = require('express-validator')

const registrationController = require('../controllers/registration.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')
const superadminMiddleware = require('../middlewares/superadmin.middleware')
const { PARTICIPANT_TYPES } = require('../models/registration.model')

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
	'/export/colleges',
	[authMiddleware, adminMiddleware, superadminMiddleware],
	registrationController.exportCollegesExcel,
)
router.get(
	'/export/vfstr-online',
	[authMiddleware, adminMiddleware, superadminMiddleware],
	registrationController.exportVfstrOnlineExcel,
)
router.get(
	'/export/vfstr-offline',
	[authMiddleware, adminMiddleware, superadminMiddleware],
	registrationController.exportVfstrOfflineExcel,
)
router.get(
	'/export/vfstr-all',
	[authMiddleware, adminMiddleware, superadminMiddleware],
	registrationController.exportVfstrAllExcel,
)
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
		body('participantType')
			.trim()
			.isIn(PARTICIPANT_TYPES)
			.withMessage(`Participant type must be one of: ${PARTICIPANT_TYPES.join(', ')}`),
		body('mode').isIn(['Offline']).withMessage('Mode must be Offline (online registrations are closed)'),
		body('apaarId').optional({ checkFalsy: true }).trim().isLength({ max: 120 }).withMessage('APAAR Id is too long'),
		body('declaration').isIn(['Yes', 'No']).withMessage('Declaration must be Yes or No'),
	],
	validateRequest,
	registrationController.create,
)
router.put(
	'/:id',
	[
		authMiddleware,
		adminMiddleware,
		param('id').isMongoId().withMessage('Invalid ID'),
		body('emailId').optional().isEmail().withMessage('Valid email is required'),
		body('mode').optional().isIn(['Online', 'Offline']).withMessage('Mode must be Online or Offline'),
		body('participantType')
			.optional()
			.trim()
			.notEmpty()
			.withMessage('Participant type cannot be empty'),
		body('apaarId').optional({ checkFalsy: true }).trim().isLength({ max: 120 }).withMessage('APAAR Id is too long'),
		body('declaration').optional().isIn(['Yes', 'No']).withMessage('Declaration must be Yes or No'),
	],
	validateRequest,
	registrationController.updateById,
)
router.delete(
	'/:id',
	[authMiddleware, adminMiddleware, param('id').isMongoId().withMessage('Invalid ID')],
	validateRequest,
	registrationController.removeById,
)

module.exports = router
