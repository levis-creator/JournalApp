// File: app/api/tags/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/utils/auth";

// Update tag
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    const data = await req.json();
    
    const tag = await prisma.tag.update({
      where: { id: params.id, userId: user.id },
      data
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update tag" }, 
      { status: 400 }
    );
  }
}

// Delete tag
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    await prisma.tag.delete({
      where: { id: params.id, userId: user.id }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to delete tag" }, 
      { status: 400 }
    );
  }
}