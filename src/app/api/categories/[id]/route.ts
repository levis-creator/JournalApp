// File: app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/utils/auth";

// Update category
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    const data = await req.json();
    
    const category = await prisma.category.update({
      where: { id: parseInt(params.id), userId: user.id },
      data
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update category" }, 
      { status: 400 }
    );
  }
}

// Delete category
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    await prisma.category.delete({
      where: { id: parseInt(params.id), userId: user.id }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to delete category" }, 
      { status: 400 }
    );
  }
}