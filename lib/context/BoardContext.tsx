"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";

import { FullBoard } from "../types";

// ----- Context -----

type BoardContextType = {
  boards: FullBoard[];
  setBoards: React.Dispatch<React.SetStateAction<FullBoard[]>>;
  selectedBoard: FullBoard | null;
  setSelectedBoard: React.Dispatch<React.SetStateAction<FullBoard | null>>;
};
const BoardContext = createContext<BoardContextType | null>(null);

// ----- Provider -----
export function BoardProvider({
  children,
  initialBoards,
}: {
  children: ReactNode;
  initialBoards: FullBoard[];
}) {
  const [boards, setBoards] = useState<FullBoard[]>(initialBoards);
  const [selectedBoard, setSelectedBoard] = useState<FullBoard | null>(
    initialBoards[0] || null
  );

  return (
    <BoardContext.Provider
      value={{ boards, setBoards, selectedBoard, setSelectedBoard }}
    >
      {children}
    </BoardContext.Provider>
  );
}

// ----- Hook -----
export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used inside BoardProvider");
  }
  return context;
};
