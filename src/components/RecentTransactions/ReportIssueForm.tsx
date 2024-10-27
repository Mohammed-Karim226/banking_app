"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { TErrorResponse, Transaction } from "@/src/types";
import { toast } from "react-hot-toast";
import { createIssue } from "@/src/utils/actions/user.actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  subject: z
    .string()
    .min(2, "Subject is required")
    .max(100, "Subject must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

const ReportIssueForm = ({
  transactionId,
  transaction,
  userId,
}: {
  transactionId: string;
  transaction: Transaction;
  userId: string;
}) => {
  const [created, setCreated] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: `${transaction?.name}`,
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const issueValues = {
        userId,
        transactionId,
        subject: values.subject,
        description: values.description,
      };

      await createIssue(issueValues);
      setCreated(true);
      router.refresh();
    } catch (error) {
      const err = error as TErrorResponse;
      toast.error(err.message, {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center px-4 py-2 border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 font-semibold rounded-lg"
          >
            <AlertCircle className="mr-2 h-5 w-5 text-red-500 dark:text-red-400" />
            Report Issue
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            {!created ? (
              <>
                <DialogTitle className="flex text-red-500 justify-start items-center">
                  <AlertCircle className="mr-2 h-6 w-6 text-red-500 dark:text-red-400" />
                  Report an Issue
                </DialogTitle>
                <DialogDescription className="font-normal text-neutral-800 font-mono">
                  For {transaction?.name}
                </DialogDescription>
              </>
            ) : (
              <DialogTitle className="flex text-green-500 justify-start items-center">
                🎉 Issue Created Successfully!
              </DialogTitle>
            )}
          </DialogHeader>

          {!created ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={transaction?.name}
                          value={transaction?.name}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the issue in detail"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    className="flex items-center px-4 py-2 border-2 border-slate-500 dark:border-slate-400 text-slate-500 dark:text-slate-400 font-semibold rounded-lg"
                    type="submit"
                  >
                    Submit Issue
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <DialogDescription className="font-normal text-neutral-800 font-mono">
              Thank you for reporting the issue. Our team will review it
              shortly.
            </DialogDescription>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportIssueForm;
