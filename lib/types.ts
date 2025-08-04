import type { Board, Column, Task, Subtask } from "@prisma/client";

// Subtask is just a Task with a parent

// Task includes nested subtasks (self-reference)
export type FullTask = Task & {
  subtasks: Subtask[];
};

// Column includes tasks (with subtasks)
export type FullColumn = Column & {
  tasks: FullTask[];
};

// Board includes columns (with tasks + subtasks)
export type FullBoard = Board & {
  columns: FullColumn[];
};
