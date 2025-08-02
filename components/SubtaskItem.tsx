"use client";

import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { Subtask } from "@/lib/types";

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

export default SubtaskItem;
