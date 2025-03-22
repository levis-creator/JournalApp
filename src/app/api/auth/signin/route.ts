import prisma from "@/lib/prisma";
import { comparePassword, generateToken } from "@/utils/auth";
import { setTokens } from "@/utils/tokenHandler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" }, 
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        password: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" }, 
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" }, 
        { status: 401 }
      );
    }

    // Create a new session record
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        valid: true,
        userAgent: req.headers.get("user-agent") || "unknown",
        ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiration
      }
    });

    // Generate JWT with session ID and user details
    const token =await generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username
    });

    // Set tokens in cookies/headers
    await setTokens(token, user.id);

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}