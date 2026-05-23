import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import RefreshToken from '../models/refreshToken.model'

const ACCESS_SECRET = process.env.JWT_SECRET || 'access_secret'
const ACCESS_EXPIRES = '15m'
const REFRESH_EXPIRES_DAYS = 7

export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES })
}

export async function signRefreshToken(userId: any) {
  const token = crypto.randomBytes(40).toString('hex')
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000)
  await RefreshToken.create({ userId, token, expiresAt })
  return token
}

export async function verifyRefreshToken(token: string) {
  const doc = await RefreshToken.findOne({ token })
  if (!doc) throw new Error('Invalid token')
  if (doc.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ token })
    throw new Error('Token expired')
  }
  return { id: doc.userId }
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET)
}
