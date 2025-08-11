"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { Board } from "@prisma/client";
import { FullTask } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createBoard(
  prevState: { message: string },
  formData: FormData
): Promise<{ message: string; board?: Board }> {
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

  const board = await prisma.board.create({
    data: {
      name: boardName as string,
      ownerId: user.id,
      columns: {
        create: columns.map((col) => ({ name: col })),
      },
    },
    include: {
      columns: {
        include: {
          tasks: {
            include: { subtasks: true },
          },
        },
      },
    },
  });
  revalidatePath("/");
  return { message: "Board created successfully", board: board };
}

export async function deleteBoard(boardId: string) {
  await prisma.board.delete({
    where: {
      id: boardId,
    },
  });
}

// actions.ts
export async function createTask(
  prevState: { message: string; task?: FullTask },
  formData: FormData
): Promise<{ message: string; task?: FullTask }> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const boardId = formData.get("boardId") as string;

  if (!title || !boardId || !status) {
    return { message: "Missing required fields" };
  }
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
  });
  const column = await prisma.column.findFirst({
    where: {
      name: status,
      boardId: board?.id,
    },
  });

  if (!column) {
    return { message: "Column not found" };
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      columnId: column.id,
    },
    include: {
      subtasks: true,
    },
  });
  revalidatePath("/");
  return { message: "Task created", task };
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath("/");
  return { message: "Task Deleted" };
}

export async function updateBoard(
  prevState: { message: string },
  formData: FormData
): Promise<{ message: string; board?: Board }> {
  const session = await getServerSession(authOptions);

  if (!session?.user.email) {
    return { message: "Unauthorized" };
  }

  const boardId = formData.get("boardId") as string;
  const boardName = formData.get("name") as string;

  if (!boardId || !boardName) {
    return { message: "Missing board ID or name" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return { message: "User not found" };

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { columns: true },
  });

  if (!board || board.ownerId !== user.id) {
    return { message: "Board not found or access denied" };
  }

  // Update board name
  const updatedBoard = await prisma.board.update({
    where: { id: boardId },
    data: {
      name: boardName,
    },
    include: {
      columns: {
        include: {
          tasks: {
            include: { subtasks: true },
          },
        },
      },
    },
  });
  let index = 0;
  // Loop through formData to update column names
  for (const [key, value] of formData.entries()) {
    if (
      key.startsWith("columns.") &&
      typeof value === "string" &&
      value.trim()
    ) {
      const newName = value.trim();

      await prisma.column.update({
        where: { id: updatedBoard.columns[index].id },
        data: { name: newName },
      });
      index++;
    }
  }
  revalidatePath("/", "layout");
  return {
    message: "Board and column names updated successfully",
    board: updatedBoard,
  };
}

export async function updateTask(
  prevState: { message: string },
  formData: FormData
): Promise<{ message: string; task?: FullTask }> {
  const session = await getServerSession(authOptions);

  if (!session?.user.email) {
    return { message: "Unauthorized" };
  }

  const taskId = formData.get("taskId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;

  if (!taskId || !title || !description || !status) {
    return { message: "Missing required fields" };
  }

  // Get task and check ownership via board relationship
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { column: { include: { board: true } }, subtasks: true },
  });

  if (!task) return { message: "Task not found" };
  if (task.column.board.ownerId !== session.user.id) {
    return { message: "Access denied" };
  }

  // Update main task fields
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      status,
    },
    include: { subtasks: true },
  });

  // Update subtasks from form data
  let subtaskIndex = 0;
  for (const [key, value] of formData.entries()) {
    if (
      key.startsWith("subtasks.") &&
      typeof value === "string" &&
      value.trim()
    ) {
      const newTitle = value.trim();

      // If existing subtask exists at this index, update it
      if (updatedTask.subtasks[subtaskIndex]) {
        await prisma.subtask.update({
          where: { id: updatedTask.subtasks[subtaskIndex].id },
          data: { title: newTitle },
        });
      } else {
        // Otherwise, create a new subtask linked to this task
        await prisma.subtask.create({
          data: { title: newTitle, taskId: updatedTask.id },
        });
      }

      subtaskIndex++;
    }
  }

  // Refresh data on client
  revalidatePath("/");

  return {
    message: "Task updated successfully",
    task: updatedTask,
  };
}
