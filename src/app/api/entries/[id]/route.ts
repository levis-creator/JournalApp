// File: app/api/entries/[id]/route.ts
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

// Get single entry
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    const entry = await prisma.journalEntry.findUnique({
      where: { id: parseInt (params.id), userId: user.id },
      include: { categories: {
        include:{
          category:true
        }
      }, tags: true }
    });
    
    return entry 
      ? NextResponse.json(entry)
      : NextResponse.json({ error: "Entry not found" }, { status: 404 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch entry" }, 
      { status: 500 }
    );
  }
}


// Update entry
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    const { title, content, categories, entryDate } = await req.json();

    // First delete existing categories
    await prisma.journalEntryCategory.deleteMany({
      where: {
        journalEntryId: parseInt(params.id)
      }
    });

    const updatedEntry = await prisma.journalEntry.update({
      where: { 
        id: parseInt(params.id), 
        userId: user.id 
      },
      data: {
        title,
        content,
        entryDate: new Date(entryDate),
        wordCount: content.split(/\s+/).length,
        categories: {
          createMany: {
            data: categories.map((categoryId: number) => ({
              categoryId
            }))
          }
        }
      },
      include: { 
        categories: {
          include: {
            category: true
          }
        },
        tags: true 
      }
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update entry" }, 
      { status: 400 }
    );
  }
}
// Delete entry
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    await prisma.journalEntry.delete({
      where: { id: parseInt(params.id), userId: user.id }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to delete entry" }, 
      { status: 400 }
    );
  }
}