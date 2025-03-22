import prisma from '@/lib/prisma';
import { hashPassword } from '@/utils/auth';
import { generateUsername } from '@/utils/usernameGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName, password } = await req.json();

    // Validate required fields
    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json(
        { message: 'All fields are required' }, 
        { status: 400 }
      );
    }

    // Generate unique username
    const username = generateUsername(email);
    const hashedPassword = await hashPassword(password);

    // Create user with correct field names
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.toLowerCase().trim(),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        createdAt: true
      }
    });

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    console.error('Signup Error:', error);

    // Handle unique constraint errors
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = error.meta?.target as string[] | undefined;
      const conflictField = target?.[0];
      
      const message = conflictField === 'email' 
        ? 'User with this email already exists' 
        : conflictField === 'username'
        ? 'Username already taken'
        : 'Unique constraint violation';

      return NextResponse.json({ message }, { status: 409 });
    }

    // Handle generic errors
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}