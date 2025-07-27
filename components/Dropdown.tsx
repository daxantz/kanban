import * as React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";

export function Dropdown({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-2 hover:opacity-70 bg-transparent hover:cursor-pointer hover:bg-transparent">
          <Image
            src="/icon-vertical-ellipsis.svg"
            width={4}
            height={16}
            alt="More options"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 ">
        {/* <DropdownMenuItem className="text-medium-grey ">
          Edit Board
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 focus:text-red-700"
          onClick={() => console.log("Delete clicked")}
        >
          Delete Board
        </DropdownMenuItem>
        <DeleteConfirmationDialog board={state.board} /> */}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
