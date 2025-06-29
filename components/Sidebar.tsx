"use client";

import Image from "next/image";
import React, { useState } from "react";
import BoardToggle from "./BoardToggle";
import DarkmodeToggle from "./DarkmodeToggle";
import { Button } from "./ui/button";

const Sidebar = () => {
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) return <SidebarToggle setIsHidden={setIsHidden} />;
  return (
    <div className={" h-screen w-1/4  md:flex  md:flex-col hidden "}>
      <div className="pl-[26px] pt-[32px] pr-[82px]">
        <div className=" md:flex items-center gap-4 hidden  mr-[82px]">
          <Image
            src={"/logo-mobile.svg"}
            className="hidden md:inline"
            width={24}
            height={25}
            alt="logo"
          />
          <span className="font-bold text-2xl hidden md:inline">Kanban</span>
        </div>
      </div>

      <div className=" my-[47px]  pr-[20px] flex flex-col justify-between  h-screen">
        <BoardToggle />
        <div className="flex flex-col gap-4">
          <DarkmodeToggle />
          <Button
            className="group flex ml-5 gap-2 bg-white  hover:bg-light-grey hover:cursor-pointer rounded-r-full py-3 pr-8 dark:bg-dark-grey"
            onClick={() => setIsHidden(!isHidden)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="text-medium-grey group-hover:text-main-purple transition-colors"
            >
              <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
              <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
              <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
              <path d="m2 2 20 20" />
            </svg>
            <span className="text-medium-grey text-base font-bold group-hover:text-main-purple">
              Hide Sidebar
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

const SidebarToggle = ({
  setIsHidden,
}: {
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Button
      className="hover:cursor-pointer hover:bg-purple-hover bg-main-purple rounded-r-full p-6 absolute bottom-8 hidden md:inline-flex "
      onClick={() => setIsHidden((isHidden) => !isHidden)}
    >
      <Image
        src={"/icon-show-sidebar.svg"}
        alt="show sidebar icon"
        width={16}
        height={10}
        quality={100}
      />
    </Button>
  );
};
