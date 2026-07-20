const express = require('express')
const { body, param, validationResult } = require('express-validator')

const sectionController = require('../controllers/section.controller')

const router = express.Router()

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	return next()
}

router.get('/', sectionController.getAll)
router.get('/:id', [param('id').isMongoId().withMessage('Invalid ID')], validateRequest, sectionController.getById)
router.post(
	'/',
	[
		body('key').trim().notEmpty().withMessage('Key is required'),
		body('title').trim().notEmpty().withMessage('Title is required'),
	],
	validateRequest,
	sectionController.create,
)
router.put(
	'/:id',
	[
		param('id').isMongoId().withMessage('Invalid ID'),
		body('key').optional().trim().notEmpty().withMessage('Key cannot be empty'),
		body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
	],
	validateRequest,
	sectionController.updateById,
)
router.delete(
	'/:id',
	[param('id').isMongoId().withMessage('Invalid ID')],
	validateRequest,
	sectionController.removeById,
)

module.exports = router
