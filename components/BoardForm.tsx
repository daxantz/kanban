import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useBoardContext } from "@/lib/context/BoardContext";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import Image from "next/image";
import React from "react";
import { Board } from "@/lib/types";

type BoardFormProps = {
  mode: "create" | "edit";
  board?: Board;
};

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),

  columns: z.array(z.string().optional()),
});
type BoardFormData = z.infer<typeof formSchema>;

const BoardForm = ({ mode, board }: BoardFormProps) => {
  const form = useForm<BoardFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: mode === "edit" ? board?.name : "",

      columns:
        mode === "edit"
          ? board?.columns.map((board) => board.name) || [""]
          : [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "columns" as never,
  });

  const { state } = useBoardContext();

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.

    // ✅ This will be type-safe and validated.
    // eslint-disable-next-line
    console.log(values);
  }
  return (
    <Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            {mode === "create" ? (
              <Button
                className="text-main-purple bg-transparent justify-start p-0 pl-6 text-base font-bold w-full hover:cursor-pointer hover:bg-light-grey"
                disabled={!state.board.columns}
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
              <Button className="bg-transparent text-black w-full hover:bg-light-grey hover:cursor-pointer">
                Edit Board
              </Button>
            )}
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left mb-6">
                {mode === "create" ? "Add New Board" : "Edit Board"}
              </DialogTitle>
            </DialogHeader>

            {/* Board Name */}
            <div className="mb-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-medium-grey font-bold">
                      Board Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Marketing Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Board Columns */}
            <div className="flex flex-col gap-3 mb-6">
              <FormLabel className="self-start text-medium-grey font-bold">
                Board Columns
              </FormLabel>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`columns.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Input placeholder={`Column ${index + 1}`} {...field} />
                      </FormControl>
                      <X
                        width={15}
                        height={15}
                        color="#828FA3"
                        onClick={() => remove(index)}
                        className="cursor-pointer"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                className="text-main-purple font-bold rounded-3xl py-2 px-[110px]"
                type="button"
                variant="secondary"
                onClick={() => append("")}
              >
                + Add Column
              </Button>
            </div>

            <Button className="bg-main-purple rounded-3xl py-2 px-[110px] font-bold text-white">
              {mode === "create" ? "Create New Board" : "Save Changes"}
            </Button>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default BoardForm;
