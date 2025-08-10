"use client";

import React from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useBoardContext } from "@/lib/context/BoardContext";

import BoardForm from "./BoardForm";
import { useRouter } from "next/navigation";
import { FullBoard } from "@/lib/types";

const BoardToggle = ({ boards }: { boards: FullBoard[] }) => {
  const { selectedBoard, setSelectedBoard } = useBoardContext();
  const [value, setValue] = React.useState(selectedBoard?.name);
  const router = useRouter();
  function handleBoardChange(boardName: string) {
    if (!boardName) return;

    setValue(boardName);

    const selectedBoard = boards.find((board) => board.name === boardName);

    if (selectedBoard) {
      setSelectedBoard(selectedBoard);
      router.push(`?board=${selectedBoard.id}`);
    }
  }

  return (
    <div>
      <p className="ml-6 mb-[19px] font-bold text-medium-grey text-base">
        ALL BOARDS ({boards?.length})
      </p>
      <ToggleGroup
        type="single"
        className="flex flex-col gap-2 items-start  w-full"
        value={value}
        onValueChange={handleBoardChange}
      >
        {boards?.map((board) => (
          <ToggleGroupItem
            key={board?.id}
            value={board?.name}
            className={cn(
              " hover:cursor-pointer data-[state=on]:text-white text-base text-medium-grey font-bold py-4 pl-6 pr-16 rounded-r-full w-full justify-start",
              selectedBoard?.name === board.name &&
                "data-[state=on]:bg-main-purple"
            )}
          >
            <Image
              src={"/icon-board.svg"}
              height={16}
              width={16}
              alt="board logo"
              className={cn(value === board?.name && "invert brightness-0")}
            />
            <span> {board?.name}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {/* <Button
        className="text-main-purple bg-transparent justify-start p-0 pl-6 text-base font-bold w-full hover:cursor-pointer hover:bg-light-grey"
        disabled={!state.board.columns}
      >
        <Image
          src={"/icon-board.svg"}
          height={16}
          width={16}
          alt="board logo"
        />
        + Create New Board
      </Button> */}
      <BoardForm mode="create" />
    </div>
  );
};

export default BoardToggle;
