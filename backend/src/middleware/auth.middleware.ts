import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'Missing Authorization' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid Authorization' })
  const token = parts[1]
  try {
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(403).json({ message: 'Forbidden' })
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}
