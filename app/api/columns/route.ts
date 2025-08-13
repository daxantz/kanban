// app/api/columns/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return NextResponse.json({ message: "Missing boardId" }, { status: 400 });
  }

  try {
    const columns = await prisma.column.findMany({
      where: { boardId },
    });

    return NextResponse.json(columns);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error fetching columns",
      },
      { status: 500 }
    );
  }
}
