import prisma from "@/lib/prisma";
import { verifyTokenWithoutDB } from "@/utils/auth-edge";
import { getToken } from "@/utils/tokenHandler";
import { User } from "@/utils/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await getToken();
    
    if (!token) {
      return NextResponse.json(
        { message: "Authorization token missing" },
        { status: 401 }
      );
    }

    const decodedToken:User = await verifyTokenWithoutDB(token);
    console.log(decodedToken)
    if (!decodedToken || !decodedToken.sessionId || !decodedToken.id) {
      return NextResponse.json(
        { message: "Invalid token format" },
        { status: 401 }
      );
    }

    // Check database for valid session
    const validSession = await prisma.session.findUnique({
      where: {
        id: decodedToken.sessionId as number,
        userId: decodedToken.id as number ,
        valid: true,
        expiresAt: { gt: new Date() }
      },
      select: {
        id: true,
        expiresAt: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
            role: true,
            createdAt: true
          }
        }
      }
    });

    if (!validSession) {
      return NextResponse.json(
        { message: "Session expired or invalid" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Verified successfully",
        user: {
          ...validSession.user,
          sessionId: validSession.id,
          sessionExpires: validSession.expiresAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { message: "Authentication verification failed" },
      { status: 401 }
    );
  }
}