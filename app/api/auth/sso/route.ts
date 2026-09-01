import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sign } from 'jsonwebtoken';

const UPS_SSO_EXCHANGE_URL = process.env.UPS_SSO_EXCHANGE_URL || 'https://portal.cosmopolitan.edu.ng/api/sso/exchange';
const PORTAL_SSO_SECRET = process.env.PORTAL_SSO_SECRET || '';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST /api/auth/sso - Handle SSO callback from UPS
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);
        const url = new URL(request.url);
        const ssoCode = body?.sso_code || url.searchParams.get('sso_code');

        if (!ssoCode) {
            return NextResponse.redirect(new URL('/admin?error=no_sso_code', request.url));
        }

        // Step 1: Exchange SSO code with UPS for user identity
        const exchangeRes = await fetch(UPS_SSO_EXCHANGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: ssoCode, portalSecret: PORTAL_SSO_SECRET }),
        });

        const exchangeData = await exchangeRes.json();

        if (!exchangeData?.valid) {
            console.error('SSO exchange failed:', exchangeData?.error);
            return NextResponse.redirect(new URL('/admin?error=sso_failed', request.url));
        }

        const { user } = exchangeData;

        // Step 2: Look up admin by email in local database
        const admin = await prisma.admin.findUnique({
            where: { email: user.email.toLowerCase() },
        });

        if (!admin || !admin.isActive) {
            console.error('Admin not found for SSO user:', user.email);
            return NextResponse.redirect(new URL('/admin?error=account_not_found', request.url));
        }

        // Step 3: Generate JWT and set cookie (same as login endpoint)
        const token = sign(
            {
                adminId: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Redirect to admin dashboard
        const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('SSO callback error:', error);
        return NextResponse.redirect(new URL('/admin?error=sso_error', request.url));
    }
}

// Handle GET requests (in case UPS redirects via GET with query params)
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const ssoCode = url.searchParams.get('sso_code');

    if (!ssoCode) {
        return NextResponse.redirect(new URL('/admin?error=no_sso_code', request.url));
    }

    const mockRequest = new NextRequest(request.url, {
        method: 'POST',
        headers: request.headers,
        body: JSON.stringify({ sso_code: ssoCode }),
    });

    return POST(mockRequest);
}
