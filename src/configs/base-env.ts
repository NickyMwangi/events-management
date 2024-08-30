import dotenv from "dotenv"

dotenv.config({ path: './.env' })

export const NODE_ENV = process.env.NODE_ENV || 'development'
export const PORT = process.env.APP_PORT || '4545'
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || ''
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || ''
export const ALLOWED_ORIGIN = process.env.ALLOWEDORIGIN || '*'
