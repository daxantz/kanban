import React from "react";
import { DialogDescription } from "./ui/dialog";
import { Board, Task } from "@/lib/types";

const DeleteDescription = ({ item }: { item: Board | Task }) => {
  if ("title" in item)
    return (
      <DialogDescription className="text-medium-grey text-base">
        Are you sure you want to delete the{" "}
        <span>&quot;{item.title}&quot;</span> task and it&apos;s subtasks? This
        action cannot be reversed.
      </DialogDescription>
    );
  return (
    <DialogDescription className="text-medium-grey text-base">
      Are you sure you want to delete the{" "}
      <span>&quot;{"name" in item && item.name}&quot;</span> board? This action
      will remove all columns and tasks and cannot be reversed.
    </DialogDescription>
  );
};

export default DeleteDescription;
