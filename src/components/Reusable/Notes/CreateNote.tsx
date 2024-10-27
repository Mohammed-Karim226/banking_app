"use client";

import { NoteAdd } from "iconsax-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Image from "next/image";
import { Textarea } from "../../ui/textarea";
import { useState } from "react";
import { TErrorResponse } from "@/src/types";
import { toast } from "react-hot-toast";
import { createNote } from "@/src/utils/actions/user.actions";
import { useDispatch } from "react-redux";
import { setFetch } from "@/src/features/userData/userDataSlice";

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
});

interface INotes {
  name: string;
  image: string;
}

interface INoteCreation {
  userId: string;
  onCreateSuccess?: () => void;
}
const CreateNote = ({ userId }: INoteCreation) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const NotesOptions: INotes[] = [
    { name: "payments", image: "/icons/payments.png" },
    { name: "messages", image: "/icons/message.png" },
    { name: "credit card", image: "/icons/creditCard.png" },
    { name: "bank", image: "/icons/bank.png" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const handleType = (type: string) => {
    setSelectedType(type);
    form.setValue("title", type); // Set the form value when a type is selected
  };

  const handleDialog = () => {
    setOpen(false);
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    handleDialog();
    try {
      await createNote({
        userId: userId,
        title: values.title ?? "",
        content: values.content ?? "",
      });
      setSelectedType("");
      form.reset();
      toast.success("Note Added Successfully.", {
        position: "bottom-right",
      });
      dispatch(setFetch());
    } catch (error) {
      const err = error as TErrorResponse;
      toast.error(err.message, {
        position: "bottom-right",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex justify-center dark:border-slate-600 items-center gap-2 py-1 px-2 text-sky-950"
        >
          <NoteAdd size="24" color="#1E3E62" /> Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-stone-500">
        <DialogHeader>
          <DialogTitle className="flex justify-start items-center gap-2">
            <Image src={"/icons/note.png"} alt="note" width={30} height={30} />
            Add Notes
          </DialogTitle>
          <DialogDescription>
            Create a Note For Service Easily.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex justify-start items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="title"
                render={({}) => (
                  <FormItem>
                    <FormLabel className="font-medium text-lg text-slate-700">
                      Note For:{" "}
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 justify-center items-center gap-2">
                        {NotesOptions.map((option) => (
                          <button
                            key={option.name}
                            type="button"
                            onClick={() => handleType(option.name)}
                            className={`flex capitalize transition-all duration-300 justify-start gap-2 items-center p-3 border border-slate-400 ${
                              selectedType === option.name
                                ? "bg-slate-200 dark:bg-slate-700"
                                : "hover:bg-slate-100 dark:hover:bg-slate-600"
                            }`}
                          >
                            <Image
                              src={option.image}
                              alt="note type"
                              width={30}
                              height={30}
                            />
                            <p className="text-neutral-800">{option.name}</p>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-lg text-slate-700">
                      Content
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add Note."
                        {...field}
                        className="w-full dark:bg-stone-700 dark:focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="flex justify-center w-full items-center bg-bankGradient text-white dark:text-slate-600"
              >
                Add Note
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNote;
