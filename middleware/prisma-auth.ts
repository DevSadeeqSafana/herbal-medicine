import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to protect Prisma Studio access
 * Only allow access with correct authentication
 */

const PRISMA_STUDIO_USERNAME = process.env.PRISMA_STUDIO_USERNAME || 'admin';
const PRISMA_STUDIO_PASSWORD = process.env.PRISMA_STUDIO_PASSWORD || 'change_this_password';

export function prismaAuthMiddleware(request: NextRequest) {
  // Check if this is a request to Prisma Studio (port 5555)
  const url = new URL(request.url);

  // Get authorization header
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Prisma Studio Access"',
      },
    });
  }

  // Parse Basic Auth
  const auth = authHeader.split(' ')[1];
  const [username, password] = Buffer.from(auth, 'base64').toString().split(':');

  // Verify credentials
  if (username !== PRISMA_STUDIO_USERNAME || password !== PRISMA_STUDIO_PASSWORD) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Prisma Studio Access"',
      },
    });
  }

  // Allow access
  return NextResponse.next();
}
