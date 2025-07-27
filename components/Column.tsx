import { Column as col, Subtask, Task } from "@/lib/types";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useBoardContext } from "@/lib/context/BoardContext";
import { Dropdown } from "./Dropdown";

import { DeleteConfirmationDialog } from "./Navbar";
import TaskForm from "./TaskForm";

const Column = ({ column }: { column: col }) => {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-medium-grey font-bold">
        {column.name} ({column.tasks.length})
      </p>
      <div className="flex flex-col gap-[20px] ">
        {column.tasks.map((todo) => (
          <TodoCard todo={todo} key={todo.title} />
        ))}
      </div>
    </div>
  );
};

export default Column;

const TodoCard = ({ todo }: { todo: Task }) => {
  const { state } = useBoardContext();
  const statuses = state.board.columns.map((c) => c.name);
  const completedSubtasks = todo.subtasks.filter(
    (todo) => todo.isCompleted === true
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          key={todo.title}
          className="bg-white rounded-md w-[280px] px-4 py-6 flex flex-col gap-2 shadow-lg hover:cursor-pointer dark:bg-very-dark-grey "
        >
          <p className="text-black dark:text-white text-base font-bold">
            {todo.title}
          </p>
          <span className="text-medium-grey">
            0 of {todo.subtasks.length} subtasks
          </span>
        </div>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogHeader className="text-left gap-6">
          <div className="flex justify-between">
            <DialogTitle className="text-lg">{todo.title}</DialogTitle>
            <Dropdown>
              {/* <DropdownMenuItem className="text-medium-grey ">
                Edit Task
              </DropdownMenuItem> */}
              <TaskForm mode="edit" task={todo} />

              <DeleteConfirmationDialog item={todo} />
            </Dropdown>
          </div>

          <DialogDescription className="text-base text-left">
            {todo.description}
          </DialogDescription>
        </DialogHeader>

        {/* Add subtask list, actions, or description here if needed */}
        <p className="font-bold text-medium-grey">
          Subtasks ({completedSubtasks.length} of {todo.subtasks.length})
        </p>
        <div className="flex flex-col gap-2">
          {todo.subtasks.map((subtask) => (
            <SubtaskItem subtask={subtask} key={subtask.title} />
          ))}
        </div>
        <div>
          <p className="text-medium-grey font-bold mb-2">Current Status</p>
          <Select>
            <SelectTrigger className="w-full text-black focus:outline-none focus:ring-1 focus:ring-main-purple focus:border-main-purple">
              <SelectValue placeholder={todo.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="text-black">
                {statuses.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="text-medium-grey"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SubtaskItem = ({ subtask }: { subtask: Subtask }) => {
  const [isChecked, setIsChecked] = useState(subtask.isCompleted);
  return (
    <div
      className="flex gap-4 bg-light-grey rounded-sm pl-3 py-4 items-center hover:bg-purple-hover hover:cursor-pointer dark:bg-dark-grey"
      onClick={() => setIsChecked((c) => !c)}
    >
      <Checkbox
        className="
    w-4 

    border 
    border-gray-300 
    rounded 
    data-[state=checked]:bg-main-purple 
    data-[state=checked]:border-main-purple
    dark:border-gray-600
    dark:data-[state=checked]:bg-main-purple
    dark:data-[state=checked]:border-main-purple
  "
        checked={isChecked}
      />
      <p
        className={cn(
          "text-dark-grey font-bold dark:text-white",
          isChecked && "decoration-1 line-through text-medium-grey"
        )}
      >
        {subtask.title}
      </p>
    </div>
  );
};
