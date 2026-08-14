import { NextResponse } from 'next/server'
import { signToken, verifyPassword } from '@/lib/auth'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const username = String(body?.username || '')
    const password = String(body?.password || '')
    const user = await verifyPassword(username, password)
    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401, headers: cors }
      )
    }
    const access_token = await signToken(user)
    return NextResponse.json({ access_token, user }, { headers: cors })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400, headers: cors }
    )
  }
}
