
// app/api/auth/login/route.ts (or wherever your login logic is)
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        const user = await prisma.user.findUnique({ where: { email } });

        // Check if user exists and if account is locked
        if (user) {
            const currentTime = new Date();

            // Check if the account is locked
            if (user.isLocked && user.lockUntil && user.lockUntil > currentTime) {
                return NextResponse.json({ message: 'Account is locked. Try again later.' }, { status: 423 }); // Locked
            }

            // Reset failed login attempts if the lock period has passed
            if (user.lockUntil && user.lockUntil < currentTime) {
                await prisma.user.update({
                    where: { email },
                    data: {
                        failedLoginAttempts: 0,
                        isLocked: false,
                        lockUntil: null,
                    },
                });
            }
        }

        // Proceed with password validation
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
            const response = NextResponse.json({ token });
            response.cookies.set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            // Reset failed login attempts upon successful login
            await prisma.user.update({
                where: { email },
                data: {
                    failedLoginAttempts: 0,
                    isLocked: false,
                    lockUntil: null,
                },
            });

            return response;

//             General Logic for the code inside the if statement

// The overall logic of this code snippet is to:

// Verify the user's credentials (email and password).
// Generate short-lived and longer-lived tokens for authentication and authorization.
// Create a response with the short-lived token and set a cookie with the longer-lived token.
// Reset failed login attempts and unlock the account (if necessary).
        } else {
            // Increment failed login attempts
            const failedAttempts = user ? user.failedLoginAttempts + 1 : 1;
            const isLocked = failedAttempts >= 5; // Lock account after 5 failed attempts

            // Update user record
            await prisma.user.update({
                where: { email },
                data: {
                    failedLoginAttempts: failedAttempts,
                    isLocked: isLocked,
                    lockUntil: isLocked ? new Date(Date.now() + 15 * 60 * 1000) : null, // Lock for 15 minutes
                },
            });

            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }
    } catch (error) {
        console.error("Error in POST /login:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
// Difference between Token and Refresh Token

// The main difference between the two tokens is their expiration time and purpose:

// token (short-lived, 1 hour):
// Used for authentication and authorization.
// Sent in the response body to the client.
// Client uses this token to access protected routes.
// When the token expires, the client needs to request a new token using the refresh token.
// refreshToken (longer-lived, 7 days):
// Used to obtain a new short-lived token when the original token expires.
// Sent in a secure cookie to the client.
// Client uses this token to request a new short-lived token when the original token expires.




// How the Code Works

// Here's a step-by-step explanation:

// Generating Tokens:
// jwt.sign() generates a JWT containing the user's ID and signs it with the JWT_SECRET key.
// Two tokens are generated: token (short-lived, 1 hour) and refreshToken (longer-lived, 7 days).
// Sending Tokens:
// The short-lived token is sent in the response body to the client using NextResponse.json({ token }).
// The longer-lived refreshToken is sent in a secure cookie to the client using response.cookies.set('refreshToken', refreshToken, {...}).
// Client-Side Token Management:
// The client receives the short-lived token and uses it to access protected routes.
// When the token expires, the client requests a new token using the refreshToken.
// The client sends the refreshToken to the server, which verifies its validity and generates a new short-lived token.