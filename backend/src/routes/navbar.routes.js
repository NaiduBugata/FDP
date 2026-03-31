const express = require('express')
const { body, param, validationResult } = require('express-validator')

const navbarController = require('../controllers/navbar.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	return next()
}

router.get('/', navbarController.getAll)
router.get('/:id', [param('id').isMongoId().withMessage('Invalid ID')], validateRequest, navbarController.getById)
router.post(
	'/',
	[
		authMiddleware,
		body('label').trim().notEmpty().withMessage('Label is required'),
		body('href').trim().notEmpty().withMessage('Href is required'),
		body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
	],
	validateRequest,
	navbarController.create,
)
router.put(
	'/:id',
	[
		authMiddleware,
		param('id').isMongoId().withMessage('Invalid ID'),
		body('label').optional().trim().notEmpty().withMessage('Label cannot be empty'),
		body('href').optional().trim().notEmpty().withMessage('Href cannot be empty'),
		body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
	],
	validateRequest,
	navbarController.updateById,
)
router.delete(
	'/:id',
	[authMiddleware, param('id').isMongoId().withMessage('Invalid ID')],
	validateRequest,
	navbarController.removeById,
)

module.exports = router
