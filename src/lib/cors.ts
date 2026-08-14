const ALLOWED_ORIGINS = new Set([
  'https://foru-tools.pages.dev',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
])

/**
 * Echo the request Origin when it is allowlisted.
 * If Origin is missing or not allowed, omit Access-Control-Allow-Origin (never *).
 */
export function corsHeaders(request: Request): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
  const origin = request.headers.get('Origin')
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}
