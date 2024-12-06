import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ message: 'Email and password are required.' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        return new Response(JSON.stringify({ id: user.id, email: user.email }), { status: 201 });
    } catch (error) {
        console.error("Error in signup route:", error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
