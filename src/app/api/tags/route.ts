// File: app/api/tags/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/utils/auth";

// Get all tags
export async function GET() {
  try {
    const user = await getAuthUser();
    const tags = await prisma.tag.findMany({
      where: { userId: user.id }
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch tags" }, 
      { status: 500 }
    );
  }
}

// Create new tag
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    const { name } = await req.json();
    
    const tag = await prisma.tag.create({
      data: {
        name,
        user: { connect: { id: user.id } }
      }
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create tag" }, 
      { status: 400 }
    );
  }
}