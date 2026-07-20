/* eslint-disable no-console */

const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const ExcelJS = require('exceljs')
const mongoose = require('mongoose')

const DEFAULT_XLSX_PATH = path.resolve(__dirname, '..', '..', 'FDP Internal Participants list.xlsx')
const DEFAULT_SHEET = null
const DEFAULT_COLLECTION = 'internal_participants'

const parseArgs = (argv) => {
	const args = {
		xlsxPath: DEFAULT_XLSX_PATH,
		sheet: DEFAULT_SHEET,
		collection: DEFAULT_COLLECTION,
		dryRun: false,
	}

	for (let index = 0; index < argv.length; index += 1) {
		const value = argv[index]
		if (value === '--xlsx' && argv[index + 1]) {
			args.xlsxPath = path.resolve(process.cwd(), argv[index + 1])
			index += 1
			continue
		}
		if (value === '--sheet' && argv[index + 1]) {
			args.sheet = argv[index + 1]
			index += 1
			continue
		}
		if (value === '--collection' && argv[index + 1]) {
			args.collection = argv[index + 1]
			index += 1
			continue
		}
		if (value === '--dry-run') {
			args.dryRun = true
		}
	}

	return args
}

const getWorksheet = (workbook, sheetName) => {
	if (sheetName) {
		const ws = workbook.getWorksheet(sheetName)
		if (!ws) {
			throw new Error(`Worksheet not found: ${sheetName}`)
		}
		return ws
	}

	if (!workbook.worksheets || workbook.worksheets.length === 0) {
		throw new Error('No worksheets found in the workbook')
	}
	return workbook.worksheets[0]
}

const cellToRaw = (cell) => {
	if (!cell) {
		return null
	}
	return cell.value ?? null
}

const cellToText = (cell) => {
	if (!cell) {
		return ''
	}

	// ExcelJS sets .text to the displayed string, including hyperlink cells.
	if (typeof cell.text === 'string') {
		return cell.text
	}

	const raw = cellToRaw(cell)
	if (raw == null) {
		return ''
	}
	return String(raw)
}

const main = async () => {
	const args = parseArgs(process.argv.slice(2))

	if (!fs.existsSync(args.xlsxPath)) {
		throw new Error(`Excel file not found: ${args.xlsxPath}`)
	}

	dotenv.config({ path: path.resolve(__dirname, '..', '.env') })
	const mongoUri = process.env.MONGO_URI
	if (!mongoUri) {
		throw new Error('MONGO_URI is not set (backend/.env)')
	}

	const workbook = new ExcelJS.Workbook()
	await workbook.xlsx.readFile(args.xlsxPath)
	const worksheet = getWorksheet(workbook, args.sheet)

	const headerRowNumber = 1
	const headerRow = worksheet.getRow(headerRowNumber)
	const headers = []
	for (let col = 1; col <= worksheet.columnCount; col += 1) {
		const cell = headerRow.getCell(col)
		headers.push(cellToText(cell))
	}

	const sourceFile = path.basename(args.xlsxPath)
	const sheetName = worksheet.name

	await mongoose.connect(mongoUri)
	const collection = mongoose.connection.db.collection(args.collection)

	const ops = []
	let dataRows = 0

	for (let rowNumber = headerRowNumber + 1; rowNumber <= worksheet.rowCount; rowNumber += 1) {
		const row = worksheet.getRow(rowNumber)

		// Skip completely empty rows.
		const hasAnyValue = row.values && row.values.some((v, i) => i !== 0 && v != null && String(v).trim() !== '')
		if (!hasAnyValue) {
			continue
		}

		const valuesText = []
		const valuesRaw = []
		for (let col = 1; col <= worksheet.columnCount; col += 1) {
			const cell = row.getCell(col)
			valuesText.push(cellToText(cell))
			valuesRaw.push(cellToRaw(cell))
		}

		const empCodeText = valuesText[1] || '' // column 2
		const serialNoText = valuesText[0] || '' // column 1

		const doc = {
			sourceFile,
			sheetName,
			headerRowNumber,
			rowNumber,
			empCode: empCodeText,
			serialNo: serialNoText,
			headers,
			valuesText,
			valuesRaw,
			importedAt: new Date(),
		}

		const filter = {
			sourceFile,
			sheetName,
			// Prefer stable uniqueness by Emp.Code; fallback to rowNumber.
			...(empCodeText ? { empCode: empCodeText } : { rowNumber }),
		}

		ops.push({
			updateOne: {
				filter,
				update: { $set: doc },
				upsert: true,
			},
		})
		dataRows += 1
	}

	if (args.dryRun) {
		console.log(`Dry-run: would upsert ${dataRows} rows into collection '${args.collection}'.`)
		console.log({ sourceFile, sheetName, headers })
		await mongoose.disconnect()
		return
	}

	const result = await collection.bulkWrite(ops, { ordered: false })
	console.log(`Imported '${sourceFile}' -> ${args.collection}`)
	console.log({
		sheetName,
		headers,
		processedRows: dataRows,
		matched: result.matchedCount,
		upserted: result.upsertedCount,
		modified: result.modifiedCount,
	})

	await mongoose.disconnect()
}

main().catch(async (error) => {
	console.error(error)
	try {
		await mongoose.disconnect()
	} catch (disconnectError) {
		// ignore
	}
	process.exit(1)
})
