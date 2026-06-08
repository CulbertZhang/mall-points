import jwt from 'jsonwebtoken'
import { config } from '../config'

export interface TokenPayload {
  userId: number
  username: string
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload as object, config.jwtSecret, { expiresIn: 7200 })
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload as object, config.jwtRefreshSecret, { expiresIn: 2592000 })
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload
}
