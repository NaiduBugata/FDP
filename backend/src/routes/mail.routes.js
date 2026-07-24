const express = require('express')

const mailController = require('../controllers/mail.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')
const superadminMiddleware = require('../middlewares/superadmin.middleware')

const router = express.Router()

router.post(
	'/test',
	[authMiddleware, adminMiddleware, superadminMiddleware],
	mailController.sendTest,
)

module.exports = router
