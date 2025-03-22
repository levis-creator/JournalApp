// File: app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/utils/auth";

// Get all categories
export async function GET() {
  try {
    const user = await getAuthUser();
    const categories = await prisma.category.findMany({
      where: { userId: user.id }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch categories" }, 
      { status: 500 }
    );
  }
}

// Create new category
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    const { name, color } = await req.json();
    
    const category = await prisma.category.create({
      data: {
        name,
        color,
        user: { connect: { id: user.id } }
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create category" }, 
      { status: 400 }
    );
  }
}