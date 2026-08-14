import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { corsHeaders } from '@/lib/cors';

function isPublicApi(pathname: string) {
  return (
    pathname.startsWith('/api/hello') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/me')
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api') && request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
  }

  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);

  if (pathname.startsWith('/api')) {
    const cors = corsHeaders(request);
    for (const [key, value] of Object.entries(cors)) {
      response.headers.set(key, value);
    }
  }

  if (pathname.startsWith('/api') && !isPublicApi(pathname)) {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== 'your-api-key-here') {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid or missing API key' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(request),
          },
        }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
