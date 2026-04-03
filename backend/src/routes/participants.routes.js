const express = require('express')

const participantsController = require('../controllers/participants.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')

const router = express.Router()

router.get('/combined', [authMiddleware, adminMiddleware], participantsController.getCombined)
router.get('/combined/export/excel', [authMiddleware, adminMiddleware], participantsController.exportCombinedExcel)

module.exports = router
