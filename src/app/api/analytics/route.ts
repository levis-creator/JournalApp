// File: app/api/analytics/route.ts
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/utils/auth";
import { NextResponse } from "next/server";

// Get journal analytics
export async function GET() {
  try {
    const user = await getAuthUser();
    
    const [entryCount, categoryStats, wordStats] = await Promise.all([
      prisma.journalEntry.count({ where: { userId: user.id } }),
      prisma.$queryRaw`
        SELECT c.name, COUNT(*)::int 
        FROM "JournalEntryCategory" jec
        JOIN "Category" c ON jec."categoryId" = c.id
        WHERE c."userId" = ${user.id}
        GROUP BY c.name
      `,
      prisma.journalEntry.aggregate({
        where: { userId: user.id },
        _avg: { wordCount: true },
        _sum: { wordCount: true },
        _max: { wordCount: true },
        _min: { wordCount: true }
      })
    ]);

    return NextResponse.json({
      totalEntries: entryCount,
      categoryDistribution: categoryStats,
      wordStatistics: {
        average: wordStats._avg.wordCount,
        total: wordStats._sum.wordCount,
        longest: wordStats._max.wordCount,
        shortest: wordStats._min.wordCount
      }
    });
    
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" }, 
      { status: 500 }
    );
  }
}