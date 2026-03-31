const express = require('express')
const { body, param, validationResult } = require('express-validator')

const registrationController = require('../controllers/registration.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	return next()
}

router.get('/', registrationController.getAll)
router.get('/:id', [param('id').isMongoId().withMessage('Invalid ID')], validateRequest, registrationController.getById)
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
