import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const userId = parseInt(decoded.id, 10);

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
    } catch (error) {
        console.error("Error in POST /reset-password:", error);
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }
}
