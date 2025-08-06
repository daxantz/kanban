import { FullColumn } from "@/lib/types";
import TodoCard from "./TodoCard";

const Column = ({ column }: { column: FullColumn }) => {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-medium-grey font-bold">
        {column.name} ({column.tasks.length})
      </p>
      <div className="flex flex-col gap-[20px] ">
        {column.tasks?.map((todo) => (
          <TodoCard todo={todo} key={todo.title} column={column} />
        ))}
      </div>
    </div>
  );
};

export default Column;
