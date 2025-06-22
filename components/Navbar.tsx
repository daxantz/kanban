"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useBoardContext } from "@/lib/context/BoardContext";

import DarkmodeToggle from "./DarkmodeToggle";
import { Board } from "@/lib/types";
import BoardToggle from "./BoardToggle";
import { Dropdown } from "./Dropdown";

// const components: { title: string; href: string; description: string }[] = [
//   {
//     title: "Alert Dialog",
//     href: "/docs/primitives/alert-dialog",
//     description:
//       "A modal dialog that interrupts the user with important content and expects a response.",
//   },
//   {
//     title: "Hover Card",
//     href: "/docs/primitives/hover-card",
//     description:
//       "For sighted users to preview content available behind a link.",
//   },
//   {
//     title: "Progress",
//     href: "/docs/primitives/progress",
//     description:
//       "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
//   },
//   {
//     title: "Scroll-area",
//     href: "/docs/primitives/scroll-area",
//     description: "Visually or semantically separates content.",
//   },
//   {
//     title: "Tabs",
//     href: "/docs/primitives/tabs",
//     description:
//       "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
//   },
//   {
//     title: "Tooltip",
//     href: "/docs/primitives/tooltip",
//     description:
//       "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
//   },
// ];

export function Navbar() {
  const { state } = useBoardContext();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex px-4 py-5 justify-between border-b-4">
      {/* <div className=" md:flex items-center gap-4 hidden ">
        <Image
          src={"/logo-mobile.svg"}
          className="hidden md:inline"
          width={24}
          height={25}
          alt="logo"
        />
        <span className="font-bold text-2xl hidden md:inline">Kanban</span>
      </div> */}
      <div className="flex ">
        <Button className="bg-transparent">
          <Image
            src={"/logo-mobile.svg"}
            className="md:hidden"
            width={24}
            height={25}
            alt="logo"
          />
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="font-bold flex items-center gap-2 hover:cursor-pointer">
            {state.board.name}
            <Image
              alt="chevron"
              width={8}
              height={4}
              src={isOpen ? "/icon-chevron-up.svg" : "/icon-chevron-down.svg"}
              className={
                "transition-transform duration-75 ease-in-out sm:hidden"
              }
            />
          </DialogTrigger>
          <DialogContent className="px-0 pr-6 text-medium-grey">
            <div>
              <DialogHeader>
                <DialogTitle className="text-left mb-[19px] pl-6">
                  All BOARDS ({state.allBoards.length})
                </DialogTitle>
              </DialogHeader>
              <BoardToggle />
            </div>
            <DarkmodeToggle />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-6">
        <Button className="bg-main-purple rounded-3xl hover:bg-purple-hover hover:cursor-pointer">
          <Image
            src={"/icon-add-task-mobile.svg"}
            width={12}
            height={12}
            alt="add icon"
            className="md:hidden"
          />
          <span className="hidden md:inline font-base font-bold">
            {" "}
            + Add New Task
          </span>
        </Button>
        <Dropdown />
      </div>
    </div>
  );
}

export function DeleteConfirmationDialog({ board }: { board: Board }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="self-end text-red">
          {/* <Image
            src={"/icon-vertical-ellipsis.svg"}
            width={4}
            height={16}
            alt="ellipsis"
          /> */}
          Delete Board
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left flex gap-6">
          <DialogTitle className="text-red text-lg">
            Delete this board?
          </DialogTitle>
          <DialogDescription className="text-medium-grey text-base">
            Are you sure you want to delete the{" "}
            <span>&quot;{board.name}&quot;</span> board? This action will remove
            all columns and tasks and cannot be reversed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-4 mt-6 justify-evenly">
          <Button
            variant="destructive"
            className="bg-red rounded-[20px] font-bold px-20 hover:bg-red-hover hover:cursor-pointer"
          >
            Delete
          </Button>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="rounded-[20px] text-main-purple font-bold px-20 hover:bg-purple-hover hover:cursor-pointer"
            >
              Cancel
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
