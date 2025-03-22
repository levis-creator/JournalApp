import { NextResponse } from "next/server";
import { getToken, removeTokens } from "@/utils/tokenHandler";
import { verifyToken } from "@/utils/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const token = await getToken();
    
    if (token) {
      // Invalidate session in database
      const decoded = await verifyToken(token);
      
      if (decoded?.sessionId) {
        await prisma.session.update({
          where: { id: decoded.sessionId as string },
          data: { valid: false }
        });
      }
    }

    // Clear client-side tokens
    await removeTokens();

    return NextResponse.json(
      { message: "Successfully signed out" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Signout Error:", error);
    return NextResponse.json(
      { message: "Failed to sign out" },
      { status: 500 }
    );
  }
}