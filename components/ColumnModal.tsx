"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useBoardContext } from "@/lib/context/BoardContext";
import { createColumn } from "@/app/actions/actions"; // You'll need this server action

import { mutate } from "swr";

const ColumnModal = ({ hasCols }: { hasCols: boolean }) => {
  const { selectedBoard } = useBoardContext();

  const [open, setOpen] = useState(false);
  const [actionState, setActionState] = useState("");
  async function handleSubmit(formData: FormData) {
    if (!selectedBoard?.id) return;
    formData.append("boardId", selectedBoard.id);

    const result = await createColumn({ message: "" }, formData);
    if (result.message === "Column created successfully") {
      await mutate(`/api/columns?boardId=${selectedBoard.id}`);
      setOpen(false);
    }
    setActionState(result.message);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {hasCols ? (
          <div className="rounded-sm flex items-center justify-center text-medium-grey font-bold w-[280px] h-screen bg-lines-light hover:cursor-pointer self-center text-xl dark:bg-very-dark-grey">
            + New Column
          </div>
        ) : (
          <Button className="bg-main-purple rounded-3xl hover:bg-purple-hover hover:cursor-pointer">
            + Add Column
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <form action={handleSubmit} method="post" className="w-full">
          <DialogHeader>
            <DialogTitle className="text-left mb-6">Add New Column</DialogTitle>
            {actionState && (
              <p className="text-sm text-red-500">{actionState}</p>
            )}
          </DialogHeader>

          {/* Column Name */}
          <div className="mb-6">
            <label
              htmlFor="columnName"
              className="text-medium-grey font-bold block mb-2"
            >
              Column Name
            </label>
            <Input
              id="columnName"
              name="columnName"
              type="text"
              required
              placeholder="e.g. In Progress"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="bg-main-purple rounded-3xl py-2 px-[110px] font-bold text-white w-full"
          >
            Create Column
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnModal;
