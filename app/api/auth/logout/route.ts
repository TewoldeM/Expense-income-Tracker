import { NextResponse } from 'next/server';

export async function DELETE() {
    const response = NextResponse.json({ message: 'Logout successful' });

    // Clear the refresh token cookie
    response.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0, // Expire immediately
    });

    return response;
}
