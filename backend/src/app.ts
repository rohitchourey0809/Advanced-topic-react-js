import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes'
import questionRoutes from './routes/question.routes'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(cookieParser())
app.use(express.json())

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/questions', questionRoutes)

const rawMongo = process.env.MONGO_URI || ''
const MONGO = rawMongo.trim()

async function connectDB() {
	if (!MONGO) {
		console.warn('MONGO_URI is not set — skipping MongoDB connection. Set MONGO_URI in your .env')
		return
	}
	if (!MONGO.startsWith('mongodb://') && !MONGO.startsWith('mongodb+srv://')) {
		console.error('Invalid MONGO_URI scheme. It must start with "mongodb://" or "mongodb+srv://"')
		console.error('Current value (trimmed):', MONGO.slice(0, 200))
		return
	}
	try {
		await mongoose.connect(MONGO)
		console.log('MongoDB connected')
	} catch (err) {
		console.error('MongoDB connection error:', err)
	}
}

connectDB()

export default app
