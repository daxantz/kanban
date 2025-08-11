"use client";

import React, { useState, useActionState, startTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";
import { X } from "lucide-react";
import { useBoardContext } from "@/lib/context/BoardContext";
import { createTask, updateTask } from "@/app/actions/actions";

import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";

import { useRouter, useSearchParams } from "next/navigation";
import { Subtask } from "@prisma/client";
import { FullTask } from "@/lib/types";

type TaskFormProps = {
  mode: "create" | "edit";
  task?: FullTask | undefined;
};

const initialState = { message: "", task: undefined };

const TaskForm = ({ mode, task }: TaskFormProps) => {
  const { selectedBoard } = useBoardContext();
  const [state, formAction] = useActionState(createTask, initialState);
  const [taskActionState, updateTaskAction] = useActionState(
    updateTask,
    initialState
  );
  const [subtasks, setSubtasks] = useState<string[]>(
    mode === "edit" && task?.subtasks.length
      ? task.subtasks.map((st: Subtask) => st.title)
      : [""]
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const boardId = searchParams.get("board");

  function addSubtask() {
    setSubtasks((prev) => [...prev, ""]);
  }

  function removeSubtask(index: number) {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  }
  async function handleSubmit(formData: FormData) {
    if (mode === "create") {
      formData.append("boardId", selectedBoard?.id ?? "");
      formAction(formData);
    } else {
      if (task) {
        formData.append("taskId", task?.id);
        formData.append("board", boardId as string);
        updateTaskAction(formData);
      }
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild disabled={!selectedBoard?.columns}>
        {mode === "create" ? (
          <Button className="bg-main-purple rounded-3xl hover:bg-purple-hover hover:cursor-pointer">
            <Image
              src={"/icon-add-task-mobile.svg"}
              width={12}
              height={12}
              alt="add icon"
              className="md:hidden"
            />
            <span className="hidden md:inline font-base font-bold">
              + Add New Task
            </span>
          </Button>
        ) : (
          <Button className="bg-transparent text-black w-full hover:bg-light-grey hover:cursor-pointer">
            Edit Task
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <form action={handleSubmit} method="post" className="w-full">
          <DialogHeader>
            <DialogTitle className="text-left mb-6">
              {mode === "create" ? "Add New Task" : "Edit Task"}
            </DialogTitle>
            <p>{state.message}</p>
            <p>{taskActionState.message}</p>
          </DialogHeader>

          {/* Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="text-medium-grey font-bold block mb-2"
            >
              Title
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={task?.title ?? ""}
              placeholder="e.g. Take coffee break"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="text-medium-grey font-bold block mb-2"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              required
              defaultValue={task?.description ?? ""}
              placeholder="e.g. It’s always good to take a break."
              className="px-4 py-2"
            />
          </div>

          {/* Subtasks */}
          <div className="flex flex-col gap-3 mb-6">
            <label className="self-start text-medium-grey font-bold mb-2">
              Subtasks
            </label>
            {subtasks.map((sub, index) => (
              <div
                key={Math.floor(Math.random() * index)}
                className="flex items-center gap-2"
              >
                <Input
                  type="text"
                  name={`subtasks.${index}`}
                  placeholder={`Subtask ${index + 1}`}
                  defaultValue={sub}
                />
                <button
                  type="button"
                  onClick={() => removeSubtask(index)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X width={15} height={15} />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addSubtask}
              className="text-main-purple font-bold rounded-3xl py-2 px-[110px]"
            >
              + Add Subtask
            </Button>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label
              htmlFor="status"
              className="text-medium-grey font-bold block mb-2"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              defaultValue={task?.status || ""}
              required
              className="w-full border rounded px-3 py-2"
            >
              {selectedBoard?.columns.map((col) => (
                <option key={col.name} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="bg-main-purple rounded-3xl py-2 px-[110px] font-bold text-white"
          >
            {mode === "create" ? "Create Task" : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
