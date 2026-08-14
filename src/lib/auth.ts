import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

export type Role = 'admin' | 'user'

export type PublicUser = {
  username: string
  role: Role
}

type SeedUser = PublicUser & { passwordHash: string }

// bcryptjs hashes only — plaintext lives in README, not here
const USERS: SeedUser[] = [
  {
    username: 'admin',
    role: 'admin',
    passwordHash: '$2b$10$BHuGfD44eIBquCJa2haYo.ktRmxjk0bSHa1jTFYeBJt4HvgnEzBDO',
  },
  {
    username: 'user',
    role: 'user',
    passwordHash: '$2b$10$m6fT.H3VUCmTqX8gPhYzvO1Tu3pJksF8o8/i8B4LmFsh5hRuuFGdW',
  },
]

function secretKey() {
  const secret = process.env.JWT_SECRET || 'foru-next-server-demo-jwt-secret'
  return new TextEncoder().encode(secret)
}

export async function verifyPassword(username: string, password: string): Promise<PublicUser | null> {
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
    if (!username || !role) return null
    return { username, role }
  } catch {
    return null
  }
}

export function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization') || ''
  const [type, token] = header.split(' ')
  if (type !== 'Bearer' || !token) return null
  return token
}
