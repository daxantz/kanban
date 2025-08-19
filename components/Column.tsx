import { FullColumn } from "@/lib/types";
import TodoCard from "./TodoCard";
import { prisma } from "@/lib/prisma";

const Column = async ({ column }: { column: FullColumn }) => {
  const tasks = await prisma.task.findMany({
    where: {
      status: column.name,
    },
    include: {
      subtasks: true,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <p className="text-medium-grey font-bold">
        {column.name} ({tasks.length})
      </p>
      <div className="flex flex-col gap-[20px] ">
        {tasks?.map((todo) => (
          <TodoCard todo={todo} key={todo.title} column={column} />
        ))}
      </div>
    </div>
  );
};

export default Column;
