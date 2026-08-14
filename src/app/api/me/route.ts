import { NextResponse } from 'next/server'
import { AuthConfigError, bearerToken, userFromToken } from '@/lib/auth'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

export async function GET(request: Request) {
  const cors = corsHeaders(request)
  try {
    const token = bearerToken(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors })
    }
    const user = await userFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors })
    }
    return NextResponse.json(user, { headers: cors })
  } catch (err) {
    if (err instanceof AuthConfigError) {
      return NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500, headers: cors }
      )
    }
    throw err
  }
}
