import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuthUser } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user=await getAuthUser()
    const userId = user.id

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const tags = await prisma.tag.findMany({
      where: { userId: userId },
    });
    const categories = await prisma.category.findMany({
      where: { userId: userId },
    });

    return NextResponse.json({ tags, categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tags and categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch tags and categories" },
      { status: 500 }
    );
  }
}