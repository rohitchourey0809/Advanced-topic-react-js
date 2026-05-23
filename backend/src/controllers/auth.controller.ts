import { Request, Response } from 'express'
import User from '../models/user.model'
import RefreshToken from '../models/refreshToken.model'
import bcrypt from 'bcrypt'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'

export async function signup(req: Request, res: Response) {
  const { email, password } = req.body
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ message: 'Email exists' })
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ email, password: hash })
  const accessToken = signAccessToken({ id: user._id })
  const refreshToken = await signRefreshToken(user._id)
  // set HttpOnly refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  res.json({ accessToken })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const accessToken = signAccessToken({ id: user._id })
  const refreshToken = await signRefreshToken(user._id)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  res.json({ accessToken })
}

export async function refreshToken(req: Request, res: Response) {
  // read token from body or HttpOnly cookie
  const token = req.body.token || req.cookies?.refreshToken
  if (!token) return res.status(400).json({ message: 'Missing token' })
  try {
    const payload = await verifyRefreshToken(token)
    // rotate refresh token
    await RefreshToken.deleteOne({ token })
    const newRefresh = await signRefreshToken(payload.id)
    const accessToken = signAccessToken({ id: payload.id })
    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.json({ accessToken })
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' })
  }
}

export async function logout(req: Request, res: Response) {
  const token = req.body.token || req.cookies?.refreshToken
  if (token) await RefreshToken.deleteOne({ token })
  res.clearCookie('refreshToken')
  res.json({ ok: true })
}
