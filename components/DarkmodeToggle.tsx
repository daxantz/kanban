"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";

const DarkmodeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(theme === "dark");

  useEffect(() => {
    setTheme(enabled ? "dark" : "light");
  }, [enabled, setTheme]);
  return (
    <div className="bg-light-grey dark:bg-very-dark-grey px-[57px] py-[14px] rounded-md ml-5 max-h-[48px]">
      <div className=" flex justify-evenly">
        <Image
          src={"/icon-light-theme.svg"}
          height={18}
          width={18}
          alt="light theme icon"
        />
        <Switch
          onCheckedChange={setEnabled}
          checked={enabled}
          className="data-[state=checked]:bg-main-purple data-[state=unchecked]:bg-main-purple "
        />
        <Image
          src={"/icon-dark-theme.svg"}
          height={18}
          width={18}
          alt="light theme icon"
        />
      </div>
    </div>
  );
};

export default DarkmodeToggle;
