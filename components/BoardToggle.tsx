"use client";

import React from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useBoardContext } from "@/lib/context/BoardContext";
import { Button } from "./ui/button";

const BoardToggle = () => {
  const { state, dispatch } = useBoardContext();
  const [value, setValue] = React.useState(state.board.name);
  function handleBoardChange(boardName: string) {
    if (!boardName) return;

    setValue(boardName);

    const selectedBoard = state.allBoards.find(
      (board) => board.name === boardName
    );

    if (selectedBoard) {
      dispatch({ type: "SET_BOARD", payload: selectedBoard });
    }
  }
  return (
    <div>
      <p className="ml-6 mb-[19px] font-bold text-medium-grey text-base">
        ALL BOARDS ({state.allBoards.length})
      </p>
      <ToggleGroup
        type="single"
        className="flex flex-col gap-2 items-start  w-full"
        value={value}
        onValueChange={handleBoardChange}
      >
        {state.allBoards.map((board) => (
          <ToggleGroupItem
            key={board.name}
            value={board.name}
            className="data-[state=on]:bg-main-purple hover:cursor-pointer data-[state=on]:text-white text-base text-medium-grey font-bold py-4 pl-6 pr-16 rounded-r-full w-full justify-start"
          >
            <Image
              src={"/icon-board.svg"}
              height={16}
              width={16}
              alt="board logo"
              className={cn(value === board.name && "invert brightness-0")}
            />
            <span> {board.name}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button
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
      </Button>
    </div>
  );
};

export default BoardToggle;
