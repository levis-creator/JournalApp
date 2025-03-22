// File: app/api/entries/route.ts
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/utils/auth";
import { verifyTokenWithoutDB } from "@/utils/auth-edge";
import { getToken } from "@/utils/tokenHandler";
import { NextResponse } from "next/server";

// Get all entries for current user
export async function GET() {
  try {
    const user = await getAuthUser();

    const entries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      include: {
        categories: {
          include:{category:true}
        },
        tags: true,
      },
    });
    
    return NextResponse.json(entries);
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch entries" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const token= await getToken()
  if(!token)
    return NextResponse.json({message:'Unauthorized'}, {status:401})

  const user=await verifyTokenWithoutDB(token!)
  if(!user)
    return NextResponse.json({message:"Invalid Token"},{status:401})

  const userId= parseInt(user.id)
  try {
    const { title, content, categories} = await request.json();

    // // Fetch or create categories
    // const categoryIds = await Promise.all(
    //   categories.map(async (name: string) => {
    //     const existingCategory = await prisma.category.findFirst({
    //       where: { name, userId },
    //     });

    //     if (existingCategory) {
    //       return existingCategory.id; // Use existing category ID (number)
    //     }

    //     // Create new category
    //     const newCategory = await prisma.category.create({
    //       data: {
    //         name,
    //         user: { connect: { id: userId } },
    //       },
    //     });

    //     return newCategory.id; // Use new category ID (number)
    //   })
    // );

    // // Fetch or create tags
    // const tagIds = await Promise.all(
    //   tags.map(async (name: string) => {
    //     const existingTag = await prisma.tag.findFirst({
    //       where: { name, userId },
    //     });

    //     if (existingTag) {
    //       return existingTag.id; // Use existing tag ID (number)
    //     }

    //     // Create new tag
    //     const newTag = await prisma.tag.create({
    //       data: {
    //         name,
    //         user: { connect: { id: userId } },
    //       },
    //     });

    //     return newTag.id; // Use new tag ID (number)
    //   })
    // );

    // Create the journal entry
    const entry = await prisma.journalEntry.create({
      data: {
        title,
        content,
        wordCount: content.split(/\s+/).length,
        user: { connect: { id: userId } },
        categories: {
          create: categories.map((id: number) => ({
            category: { connect: { id } }, // Use number for ID
          })),
        },
        // tags: {
        //   create: tagIds.map((id: number) => ({
        //     tag: { connect: { id } }, // Use number for ID
        //   })),
        // },
      },
      include: { categories: true, tags: true },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json(
      { message: "Failed to create journal entry" },
      { status: 500 }
    );
  }
}