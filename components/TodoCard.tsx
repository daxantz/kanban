"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dropdown } from "./Dropdown";

import { DeleteConfirmationDialog } from "./Navbar";
import TaskForm from "./TaskForm";
import { FullColumn, FullTask } from "@/lib/types";
import SubtaskItem from "./SubtaskItem";
import { useBoardContext } from "@/lib/context/BoardContext";

const TodoCard = ({ todo, column }: { todo: FullTask; column: FullColumn }) => {
  const { selectedBoard } = useBoardContext();

  const statuses = selectedBoard?.columns.map((c) => c.name);
  // const completedSubtasks = todo.subtasks.filter(
  //   (todo) => todo.isCompleted === true
  // );

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
          {/* Subtasks ({completedSubtasks.length} of {todo.subtasks.length}) */}
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
                {statuses?.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="text-medium-grey"
                    defaultValue={column.name}
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

export default TodoCard;
