const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

const validateEnv = () => {
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI is required')
	}

	if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'replace_with_strong_secret') {
		throw new Error('JWT_SECRET is not configured for deployment')
	}
}

const startServer = async () => {
	try {
		validateEnv()
		await connectDB()
		const server = app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})

		const shutdown = () => {
			server.close(() => process.exit(0))
		}

		process.on('SIGINT', shutdown)
		process.on('SIGTERM', shutdown)
	} catch (error) {
		console.error('Failed to start server:', error.message)
		process.exit(1)
	}
}

startServer()
