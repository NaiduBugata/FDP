const express = require('express')
const { body, param, validationResult } = require('express-validator')

const scheduleController = require('../controllers/schedule.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	return next()
}

router.get('/', scheduleController.getAll)
router.get('/:id', [param('id').isMongoId().withMessage('Invalid ID')], validateRequest, scheduleController.getById)
router.post(
	'/',
	[
		authMiddleware,
		body('title').trim().notEmpty().withMessage('Title is required'),
		body('text').trim().notEmpty().withMessage('Text is required'),
		body('date').optional().isISO8601().withMessage('Date must be valid ISO date'),
	],
	validateRequest,
	scheduleController.create,
)
router.put(
	'/:id',
	[
		authMiddleware,
		param('id').isMongoId().withMessage('Invalid ID'),
		body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
		body('text').optional().trim().notEmpty().withMessage('Text cannot be empty'),
		body('date').optional().isISO8601().withMessage('Date must be valid ISO date'),
	],
	validateRequest,
	scheduleController.updateById,
)
router.delete(
	'/:id',
	[authMiddleware, param('id').isMongoId().withMessage('Invalid ID')],
	validateRequest,
	scheduleController.removeById,
)

module.exports = router
