const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth.routes')
const committeeRoutes = require('./routes/committee.routes')
const navbarRoutes = require('./routes/navbar.routes')
const registrationRoutes = require('./routes/registration.routes')
const scheduleRoutes = require('./routes/schedule.routes')
const sectionRoutes = require('./routes/section.routes')
const speakerRoutes = require('./routes/speaker.routes')
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware')

const app = express()

const allowedOrigins = (process.env.CORS_ORIGINS || '')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean)

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
			return callback(null, true)
		}

		return callback(new Error('Not allowed by CORS'))
	},
}

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: Number(process.env.RATE_LIMIT_MAX || 600),
	standardHeaders: true,
	legacyHeaders: false,
})

app.set('trust proxy', 1)

app.use(helmet())
app.use(compression())
app.use('/api', apiLimiter)

app.use(cors(corsOptions))
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
