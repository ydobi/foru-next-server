import { NextResponse } from 'next/server'
import { bearerToken, userFromToken } from '@/lib/auth'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors })
}

export async function GET(request: Request) {
  const token = bearerToken(request)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors })
  }
  const user = await userFromToken(token)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors })
  }
  return NextResponse.json(user, { headers: cors })
}
