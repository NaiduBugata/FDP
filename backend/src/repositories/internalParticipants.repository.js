const mongoose = require('mongoose')

const COLLECTION_NAME = 'internal_participants'

const getCollection = () => {
	const db = mongoose.connection?.db
	if (!db) {
		const error = new Error('Database connection is not ready')
		error.statusCode = 500
		throw error
	}
	return db.collection(COLLECTION_NAME)
}

const getAllRaw = async () => {
	const collection = getCollection()
	return collection.find({}).sort({ rowNumber: 1, _id: 1 }).toArray()
}

module.exports = {
	getAllRaw,
}
