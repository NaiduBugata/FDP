const express = require('express')
const { body, param, validationResult } = require('express-validator')

const speakerController = require('../controllers/speaker.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	return next()
}

router.get('/', speakerController.getAll)
router.get('/:id', [param('id').isMongoId().withMessage('Invalid ID')], validateRequest, speakerController.getById)
router.post(
	'/',
	[
		authMiddleware,
		body('name').trim().notEmpty().withMessage('Name is required'),
		body('role').trim().notEmpty().withMessage('Role is required'),
		body('org').trim().notEmpty().withMessage('Organization is required'),
	],
	validateRequest,
	speakerController.create,
)
router.put(
	'/:id',
	[
		authMiddleware,
		param('id').isMongoId().withMessage('Invalid ID'),
		body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
		body('role').optional().trim().notEmpty().withMessage('Role cannot be empty'),
		body('org').optional().trim().notEmpty().withMessage('Organization cannot be empty'),
	],
	validateRequest,
	speakerController.updateById,
)
router.delete(
	'/:id',
	[authMiddleware, param('id').isMongoId().withMessage('Invalid ID')],
	validateRequest,
	speakerController.removeById,
)

module.exports = router
