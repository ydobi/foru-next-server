import { getCloudflareContext } from '@opennextjs/cloudflare'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

export type Role = 'admin' | 'user'

export type PublicUser = {
  username: string
  role: Role
}

type SeedUser = PublicUser & { passwordHash: string }

type UserRow = {
  username: string
  password_hash: string
  role: string
}

export class AuthConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthConfigError'
  }
}

// bcryptjs hashes only — plaintext lives in README, not here
const USERS: SeedUser[] = [
  {
    username: 'admin',
    role: 'admin',
    passwordHash: '$2b$10$0bGSwXV5FmE3EjlOGF3sIudY0fIHd3.H1rlbn4OBNEnZ2Xz6JGTdO',
  },
  {
    username: 'user',
    role: 'user',
    passwordHash: '$2b$10$NhdrpPUrx850yYQRIGHZiudOWGeBuaCnz.DvYZ8IoSeliboWpSnR6',
  },
]

/** Local `next dev` only. Never used when Cloudflare context/DB is present or NODE_ENV=production. */
const LOCAL_DEV_JWT_SECRET = 'foru-next-server-local-dev-only'

function hasCloudflareContext(): boolean {
  try {
    return Boolean(getCloudflareContext())
  } catch {
    return false
  }
}

function secretKey() {
  const fromEnv = process.env.JWT_SECRET?.trim()
  if (fromEnv) {
    return new TextEncoder().encode(fromEnv)
  }

  // Fail closed in production / when D1 or Cloudflare context is present.
  if (process.env.NODE_ENV === 'production' || hasCloudflareContext() || getD1()) {
    throw new AuthConfigError('JWT_SECRET is required')
  }

  return new TextEncoder().encode(LOCAL_DEV_JWT_SECRET)
}

/**
 * Production Workers expose D1 via getCloudflareContext().env.DB.
 * `next dev` has no Worker bindings unless initOpenNextCloudflareForDev is used,
 * so this returns undefined and login falls back to the in-memory seed users.
 */
function getD1(): D1Database | undefined {
  try {
    const db = getCloudflareContext().env.DB
    if (db && typeof db.prepare === 'function') {
      return db
    }
  } catch {
    // local next dev / missing Cloudflare context
  }
  return undefined
}

function asPublicUser(username: string, role: string): PublicUser | null {
  if (role !== 'admin' && role !== 'user') return null
  return { username, role }
}

export async function verifyPassword(username: string, password: string): Promise<PublicUser | null> {
  const db = getD1()
  if (db) {
    const row = await db
      .prepare('SELECT username, password_hash, role FROM users WHERE username = ?')
      .bind(username)
      .first<UserRow>()
    if (!row) return null
    const ok = await bcrypt.compare(password, row.password_hash)
    if (!ok) return null
    return asPublicUser(row.username, row.role)
  }

  const found = USERS.find((u) => u.username === username)
  if (!found) return null
  const ok = await bcrypt.compare(password, found.passwordHash)
  if (!ok) return null
  return { username: found.username, role: found.role }
}

export async function signToken(user: PublicUser): Promise<string> {
  return new SignJWT({ username: user.username, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.username)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey())
}

export async function userFromToken(token: string): Promise<PublicUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey())
    const username = String(payload.username || payload.sub || '')
    const role = payload.role === 'admin' ? 'admin' : payload.role === 'user' ? 'user' : null
    if (!username || role === null) return null
    return { username, role }
  } catch (err) {
    if (err instanceof AuthConfigError) throw err
    return null
  }
}

export function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization') || ''
  const [type, token] = header.split(' ')
  if (type !== 'Bearer' || !token) return null
  return token
}
