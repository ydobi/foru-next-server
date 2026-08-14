import { NextResponse } from 'next/server'
import { AuthConfigError, signToken, verifyPassword } from '@/lib/auth'
import { corsHeaders } from '@/lib/cors'

type LoginBody = {
  username?: unknown
  password?: unknown
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

export async function POST(request: Request) {
  const cors = corsHeaders(request)
  try {
    const body = (await request.json()) as LoginBody
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
  } catch (err) {
    if (err instanceof AuthConfigError) {
      return NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500, headers: cors }
      )
    }
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400, headers: cors }
    )
  }
}
