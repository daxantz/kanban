"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const SignIn = () => {
  return (
    <div className="flex  min-h-screen items-center justify-center">
      <Card className="max-w-1/4 mx-auto my">
        <CardHeader className="flex justify-center flex-col items-center gap-10">
          <CardTitle>
            <Image
              src={"/logo-dark.svg"}
              height={200}
              width={250}
              alt="kanban logo"
            />
          </CardTitle>
          <CardDescription className="text-base text-center ">
            Kanban made simple. Productivity made powerful!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            className="bg-main-purple hover:bg-purple-hover hover:cursor-pointer font-bold text-1xl"
            onClick={() => signIn("google")}
          >
            <FaGoogle />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
