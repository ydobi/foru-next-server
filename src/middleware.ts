import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isPublicApi(pathname: string) {
  return (
    pathname.startsWith('/api/hello') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/me')
  );
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api') && request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders() });
  }

  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);

  if (pathname.startsWith('/api')) {
    const cors = corsHeaders();
    response.headers.set('Access-Control-Allow-Origin', cors['Access-Control-Allow-Origin']);
    response.headers.set('Access-Control-Allow-Methods', cors['Access-Control-Allow-Methods']);
    response.headers.set('Access-Control-Allow-Headers', cors['Access-Control-Allow-Headers']);
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
            ...corsHeaders(),
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
