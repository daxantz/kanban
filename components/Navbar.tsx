"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useBoardContext } from "@/lib/context/BoardContext";

import DarkmodeToggle from "./DarkmodeToggle";
import { Board, Task } from "@/lib/types";
import BoardToggle from "./BoardToggle";
import { Dropdown } from "./Dropdown";

import DeleteDescription from "./DeleteDescription";
import TaskForm from "./TaskForm";
import BoardForm from "./BoardForm";
import { signOut, useSession } from "next-auth/react";

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
  const { data } = useSession();
  // console.log(session?.user);
  const [isOpen, setIsOpen] = React.useState(false);
  const userName = data?.user.name?.split(" ")[0];

  // if (!session)
  //   return (
  //     <div>
  //       <p>not logged in</p>
  //       <button onClick={() => signIn("google")}>google sign in</button>
  //     </div>
  //   );
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

      <div className="flex gap-4">
        {/* {data?.user.image && (
          <Image
            src={data?.user?.image}
            alt="user profile image"
            width={38}
            height={48}
            className="rounded-full "
          />
        )} */}
        <p className="self-center">Welcome, {userName}</p>
        <TaskForm mode="create" />
        <Dropdown>
          {/* <DropdownMenuItem className="text-medium-grey ">
            Edit Board
          </DropdownMenuItem> */}
          <BoardForm mode="edit" board={state.board} />

          <DeleteConfirmationDialog item={state.board} />
          <Button className="w-full" onClick={() => signOut()}>
            sign out
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}

export function DeleteConfirmationDialog({ item }: { item: Board | Task }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="self-end text-red w-full hover:cursor-pointer"
        >
          {/* <Image
            src={"/icon-vertical-ellipsis.svg"}
            width={4}
            height={16}
            alt="ellipsis"
          /> */}
          Delete {"name" in item ? "board" : "task"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="text-left flex gap-6">
          <DialogTitle className="text-red text-lg">
            Delete this {"name" in item ? "board" : "task"}?
          </DialogTitle>
          <DeleteDescription item={item} />
        </DialogHeader>

        <DialogFooter className="flex gap-4 mt-6 ">
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="rounded-[20px] text-main-purple font-bold px-20 hover:bg-purple-hover hover:cursor-pointer md:order-2"
            >
              Cancel
            </Button>
          </DialogTrigger>
          <Button
            variant="destructive"
            className="bg-red rounded-[20px] font-bold px-20 hover:bg-red-hover hover:cursor-pointer md:order-1"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
