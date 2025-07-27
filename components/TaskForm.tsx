"use client";

import React from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useBoardContext } from "@/lib/context/BoardContext";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { Task } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  subtasks: z.array(z.string().optional()),
});
type TaskFormData = z.infer<typeof formSchema>;

export type TaskFormProps = {
  mode: "create" | "edit";
  task?: Task;
};
const TaskForm = ({ mode, task }: TaskFormProps) => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: mode === "edit" ? task?.title : "",
      description: mode === "edit" ? task?.description || "" : "",
      status: mode === "edit" ? task?.status || "" : "",
      subtasks:
        mode === "edit" ? task?.subtasks.map((st) => st.title) || [""] : [""],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks" as never,
  });

  const boards = useBoardContext();

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.

    // ✅ This will be type-safe and validated.
    // eslint-disable-next-line
    console.log(values);
  }
  //   console.log(task?.subtasks);
  return (
    <Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            {mode === "create" ? (
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
            ) : (
              <Button className="bg-transparent text-black w-full hover:bg-light-grey hover:cursor-pointer">
                Edit Task
              </Button>
            )}
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left mb-6">
                {mode === "create" ? "Add New Task" : "Edit Task"}
              </DialogTitle>
            </DialogHeader>
            <div className="mb-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Take coffee break " {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. It’s always good to take a break. This 
15 minute break will  recharge the batteries 
a little. "
                        className="px-4 py-2"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <FormLabel className="self-start">Subtasks</FormLabel>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`subtasks.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex  items-center gap-2">
                      <FormControl>
                        <Input
                          placeholder={`Subtask ${index + 1}`}
                          {...field}
                        />
                      </FormControl>

                      <X
                        width={15}
                        height={15}
                        color="#828FA3"
                        onClick={() => remove(index)}
                        className=""
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
                + Add Subtask
              </Button>
            </div>

            <div className="mb-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={boards.state.board.columns[0].name}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {boards.state.board.columns.map((col) => (
                              <SelectItem key={col.name} value={col.name}>
                                {col.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button className="bg-main-purple rounded-3xl py-2 px-[110px] font-bold text-white">
              Create Task
            </Button>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};

export default TaskForm;
