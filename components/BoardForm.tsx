import React, { startTransition, useActionState } from "react";
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
import { createBoard, updateBoard } from "@/app/actions/actions";
import { FullBoard } from "@/lib/types";
import { useBoardContext } from "@/lib/context/BoardContext";
import { useRouter } from "next/navigation";

type BoardFormProps = {
  mode: "create" | "edit";
  board?: FullBoard | null;
  boards?: FullBoard[];
};

const initialState = {
  message: "",
};

const BoardForm = ({ mode, board }: BoardFormProps) => {
  const { setBoards, setSelectedBoard } = useBoardContext();
  const router = useRouter();
  const [columns, setColumns] = React.useState<string[]>(() => {
    //  mode === "edit" && board?.columns.length
    //   ? board.columns.map((col) => col.name)
    //   : [""]

    if (!board?.columns) return [""];

    return mode === "edit" ? board.columns.map((col) => col.name) : [""];
  });
  const [state] = useActionState(createBoard, initialState);
  function addColumn() {
    setColumns((prev) => [...prev, ""]);
  }

  function removeColumn(index: number) {
    setColumns((prev) => prev.filter((_, i) => i !== index));
  }

  // function updateColumnName(index: number, value: string) {
  //   setColumns((prev) => {
  //     const newCols = [...prev];
  //     newCols[index] = value;
  //     return newCols;
  //   });
  // }
  async function handleSubmit(formData: FormData) {
    if (mode === "create") {
      const newBoard = await createBoard({ message: "" }, formData);
      setBoards((boards) => {
        return [...boards, newBoard?.board as FullBoard];
      });
    } else if (mode === "edit" && board) {
      formData.append("boardId", board?.id);
      const updatedBoard = await updateBoard({ message: "" }, formData);
      setBoards((boards) => {
        const allBoards: FullBoard[] = [...boards, updatedBoard] as FullBoard[];
        return allBoards.filter((b) => b.name !== board.name);
      });
      startTransition(() => {
        if (updatedBoard) {
          setSelectedBoard(updatedBoard?.board as FullBoard);
        }

        router.refresh();
      });
    }
  }

  return (
    <Dialog>
      {/* This is the button that opens the dialog */}
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button
            className="text-main-purple bg-transparent justify-start p-0 pl-6 text-base font-bold w-full hover:cursor-pointer hover:bg-light-grey"
            disabled={columns.length === 0}
            type="button"
          >
            <Image
              src="/icon-add-board.svg"
              width={12}
              height={12}
              alt="add icon"
              className="md:hidden"
            />
            <span className="hidden md:inline font-base font-bold">
              + Create New Board
            </span>
          </Button>
        ) : (
          <Button
            className="bg-transparent text-black w-full hover:bg-light-grey hover:cursor-pointer"
            type="button"
          >
            Edit Board
          </Button>
        )}
      </DialogTrigger>

      {/* The form is inside the dialog content */}
      <DialogContent>
        <form
          method="post"
          action={handleSubmit} // Your server action or API route
          className="w-full"
        >
          <DialogHeader>
            <DialogTitle className="text-left mb-6">
              {mode === "create" ? "Add New Board" : "Edit Board"}
            </DialogTitle>
            <p>{state.message}</p>
          </DialogHeader>

          {/* Board Name */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="text-medium-grey font-bold block mb-2"
            >
              Board Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={mode === "edit" ? board?.name : ""}
              placeholder="e.g. Marketing Plan"
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {/* Board Columns */}
          <div className="flex flex-col gap-3 mb-6">
            <label className="self-start text-medium-grey font-bold mb-2">
              Board Columns
            </label>

            {columns.map((col, index) => (
              <div key={col} className="flex items-center gap-2">
                <input
                  type="text"
                  name={`columns.${index}`}
                  defaultValue={col}
                  // onChange={(e) => updateColumnName(index, e.target.value)}
                  placeholder={`Column ${index + 1}`}
                  className="flex-grow rounded border px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeColumn(index)}
                  className="text-gray-500 hover:text-red-600"
                  aria-label={`Remove column ${index + 1}`}
                >
                  <X width={15} height={15} />
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              onClick={addColumn}
              className="text-main-purple font-bold rounded-3xl py-2 px-[110px]"
            >
              + Add Column
            </Button>
          </div>

          {/* This is the submit button */}
          <Button
            type="submit"
            className="bg-main-purple rounded-3xl py-2 px-[110px] font-bold text-white"
          >
            {mode === "create" ? "Create New Board" : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BoardForm;
