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
const DEFAULT_ORIGINS = [
	'http://localhost:5173',
	'https://advanced-topic-react-js-hn5a.vercel.app',
	'https://advanced-topic-react-js.vercel.app'
]
const allowed = (process.env.FRONTEND_ORIGINS || DEFAULT_ORIGINS.join(',')).split(',').map(s => s.trim())
app.use(cors({
	origin: (origin, callback) => {
		// allow server-to-server or same-origin requests with no origin
		if (!origin) return callback(null, true)
		if (allowed.includes(origin)) return callback(null, true)
		return callback(new Error('CORS not allowed'), false)
	},
	credentials: true
}))
app.use(cookieParser())
app.use(express.json())

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/questions', questionRoutes)

// simple root and health endpoints for quick checks
app.get('/', (_req, res) => res.send('API server is running'))
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

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
