"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function createBoard(
  prevState: { message: string },
  formData: FormData
): Promise<{ message: string }> {
  const session = await getServerSession(authOptions);
  const boardName = formData.get("name");

  const columns: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (
      key.startsWith("columns.") &&
      typeof value === "string" &&
      value.trim()
    ) {
      columns.push(value.trim());
    }
  }

  if (!session?.user.email) {
    return { message: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return { message: "User not found" };

  const existingBoard = await prisma.board.findFirst({
    where: { name: boardName as string, ownerId: user.id },
  });

  if (existingBoard) {
    return { message: "A board with this name already exists" };
  }

  await prisma.board.create({
    data: {
      name: boardName as string,
      ownerId: user.id,
      columns: {
        create: columns.map((col) => ({ name: col })),
      },
    },
  });

  return { message: "Board created successfully" };
}
