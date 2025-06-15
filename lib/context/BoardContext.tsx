"use client";

import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
} from "react";
import { Board, Task } from "@/lib/types";
import boardData from "@/data.json";
// ----- State Type -----
type BoardState = {
  board: Board;
};

// ----- Action Types -----
type BoardAction =
  | { type: "ADD_COLUMN"; payload: string }
  | { type: "ADD_TASK"; payload: { columnName: string; task: Task } }
  | {
      type: "TOGGLE_SUBTASK";
      payload: { columnName: string; taskTitle: string; subtaskIndex: number };
    };

// ----- Initial State -----
const initialState: BoardState = {
  board: boardData.boards[0],
};

// ----- Reducer -----
function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "ADD_COLUMN":
      return {
        ...state,
        board: {
          ...state.board,
          columns: [
            ...state.board.columns,
            { name: action.payload, tasks: [] },
          ],
        },
      };

    case "ADD_TASK":
      return {
        ...state,
        board: {
          ...state.board,
          columns: state.board.columns.map((col) =>
            col.name === action.payload.columnName
              ? {
                  ...col,
                  tasks: [...col.tasks, action.payload.task],
                }
              : col
          ),
        },
      };

    case "TOGGLE_SUBTASK":
      return {
        ...state,
        board: {
          ...state.board,
          columns: state.board.columns.map((col) => {
            if (col.name !== action.payload.columnName) return col;

            return {
              ...col,
              tasks: col.tasks.map((task) => {
                if (task.title !== action.payload.taskTitle) return task;

                const updatedSubtasks = task.subtasks.map((sub, idx) =>
                  idx === action.payload.subtaskIndex
                    ? { ...sub, isCompleted: !sub.isCompleted }
                    : sub
                );

                return { ...task, subtasks: updatedSubtasks };
              }),
            };
          }),
        },
      };

    default:
      return state;
  }
}

// ----- Context -----
const BoardContext = createContext<{
  state: BoardState;
  dispatch: Dispatch<BoardAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// ----- Provider -----
export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
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
