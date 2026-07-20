const express = require('express')

const externalParticipantsController = require('../controllers/externalParticipants.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

const router = express.Router()

router.get('/', [authMiddleware, adminMiddleware], externalParticipantsController.getAll)
router.get('/export/excel', [authMiddleware, adminMiddleware], externalParticipantsController.exportExcel)

module.exports = router
