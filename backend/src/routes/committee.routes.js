const express = require('express')
const { body, param, validationResult } = require('express-validator')

const committeeController = require('../controllers/committee.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	return next()
}

router.get('/', committeeController.getAll)
router.get('/:id', [param('id').isMongoId().withMessage('Invalid ID')], validateRequest, committeeController.getById)
router.post(
	'/',
	[
		authMiddleware,
		body('name').trim().notEmpty().withMessage('Name is required'),
		body('role').trim().notEmpty().withMessage('Role is required'),
		body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
	],
	validateRequest,
	committeeController.create,
)
router.put(
	'/:id',
	[
		authMiddleware,
		param('id').isMongoId().withMessage('Invalid ID'),
		body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
		body('role').optional().trim().notEmpty().withMessage('Role cannot be empty'),
		body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
	],
	validateRequest,
	committeeController.updateById,
)
router.delete(
	'/:id',
	[authMiddleware, param('id').isMongoId().withMessage('Invalid ID')],
	validateRequest,
	committeeController.removeById,
)

module.exports = router
