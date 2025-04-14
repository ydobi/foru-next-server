import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 这个中间件将应用于所有路由
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 记录请求日志
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);

  // 为API路由添加CORS头
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
  }

  // 简单的API密钥验证示例（仅用于演示）
  // 在实际应用中，应该使用更安全的认证方法
  if (request.nextUrl.pathname.startsWith('/api') && 
      request.method !== 'OPTIONS') {
    const apiKey = request.headers.get('x-api-key');
    
    // 跳过 /api/hello 路由的验证，使其可以公开访问
    if (!request.nextUrl.pathname.startsWith('/api/hello')) {
      // 检查API密钥（这里使用一个示例值）
      if (apiKey !== 'your-api-key-here') {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid or missing API key' }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }
  }

  return response;
}

// 配置中间件应用的路径
export const config = {
  matcher: [
    // 应用于所有API路由
    '/api/:path*',
    // 排除特定路径
    // '/((?!_next/static|favicon.ico).*)',
  ],
};