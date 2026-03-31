const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const committeeRoutes = require('./routes/committee.routes')
const navbarRoutes = require('./routes/navbar.routes')
const registrationRoutes = require('./routes/registration.routes')
const scheduleRoutes = require('./routes/schedule.routes')
const sectionRoutes = require('./routes/section.routes')
const speakerRoutes = require('./routes/speaker.routes')
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware')

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.get('/api/health', (req, res) => {
	res.status(200).json({ message: 'API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/committees', committeeRoutes)
app.use('/api/navbars', navbarRoutes)
app.use('/api/registrations', registrationRoutes)
app.use('/api/schedules', scheduleRoutes)
app.use('/api/sections', sectionRoutes)
app.use('/api/speakers', speakerRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
