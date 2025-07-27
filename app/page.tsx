"use client";
import Column from "@/components/Column";

import { Button } from "@/components/ui/button";
import { useBoardContext } from "@/lib/context/BoardContext";
import Image from "next/image";

export default function Home() {
  const { state } = useBoardContext();

  if (!state.board.columns)
    return (
      <div className="flex flex-col items-center px-4 border h-screen justify-center">
        <p className="text-medium-grey font-bold text-center mb-6">
          This board is empty. Create a new column to get started.
        </p>
        <Button className="bg-main-purple rounded-4xl font-bold hover:cursor-pointer hover:bg-purple-hover ">
          <Image
            src={"/icon-add-task-mobile.svg"}
            alt="plus icon"
            width={8}
            height={5}
          />
          Add New Column
        </Button>
      </div>
    );

  return (
    <div className="px-4 py-6 flex gap-6  overflow-x-scroll bg-light-grey dark:bg-dark-grey">
      {state.board.columns.map((col) => (
        <Column column={col} key={col.name} />
      ))}
      <div className="flex flex-col gap-6">
        <div className="bg-transparent text-transparent">pcaeholder</div>
        <div className="rounded-sm flex items-center justify-center text-medium-grey font-bold w-[280px] h-screen bg-lines-light hover:cursor-pointer self-center text-xl dark:bg-very-dark-grey">
          + New Column
        </div>
      </div>
    </div>
  );
}
