const express = require('express')

const internalParticipantsController = require('../controllers/internalParticipants.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

const router = express.Router()

router.get('/', [authMiddleware, adminMiddleware], internalParticipantsController.getAll)
router.get('/export/excel', [authMiddleware, adminMiddleware], internalParticipantsController.exportExcel)

module.exports = router
