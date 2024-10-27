"use client";

import { TNote } from "@/src/types";
import { getNotes } from "@/src/utils/actions/user.actions";
import dayjs from "dayjs";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import UpdateNote from "../../Reusable/Notes/UpdateNote";
import DeleteConfirmationDialog from "../../Reusable/Notes/DeleteConfirmationDialog";
import { useSelector } from "react-redux";
import { TRootState } from "@/src/store/redux";
import { cn } from "@/lib/utils";
import Image from "next/image";

const GetNotes = ({ userId }: { userId: string }) => {
  const [note, setNote] = useState<TNote[]>([]);
  console.log(note);
  const refetch = useSelector((state: TRootState) => state.user.refetch);

  const fetchNotes = async () => {
    const fetchedNotes = await getNotes({ userId });

    setNote(fetchedNotes);
  };

  useEffect(() => {
    fetchNotes();
  }, [userId, refetch]);

  const NotesOptions = [
    { name: "payments", image: "/icons/payments.png" },
    { name: "messages", image: "/icons/message.png" },
    { name: "credit card", image: "/icons/creditCard.png" },
    { name: "bank", image: "/icons/bank.png" },
  ];

  const getNoteImage = (title: string) => {
    const option = NotesOptions.find((opt) => title.includes(opt.name));
    return option?.image;
  };
  return (
    <div className="flex flex-col w-full gap-3  justify-start items-start">
      <h1 className="header-2 mb-2 dark:text-slate-600">Notes</h1>
      {note.length === 0 ? (
        <div className="w-full flex justify-center items-center">
          <p className="text-base text-slate-500">No Notes to View.</p>
        </div>
      ) : (
        note.map((n: TNote) => (
          <div
            key={n.id}
            className={cn(
              "flex w-full border bg-slate-50/20 border-slate-100 dark:border-slate-800 rounded-md p-4 shadow-md justify-between items-start"
            )}
          >
            <div className="flex gap-1 flex-col justify-start items-start">
              <h2
                className={cn(
                  "text-slate-700 flex justify-start items-center gap-1 font-medium capitalize dark:text-slate-700 px-2 py-1 rounded-md",
                  n?.title.includes("messages")
                    ? "bg-violet-900/20"
                    : n?.title.includes("payments")
                    ? "bg-slate-500/20"
                    : n?.title.includes("credit card")
                    ? "bg-orange-500/20"
                    : "bg-green-500/20"
                )}
              >
                <Image
                  src={getNoteImage(n?.title) ?? ""}
                  alt={n?.title}
                  width={20}
                  height={20}
                />{" "}
                {n?.title}
              </h2>
              <p className="text-sm dark:text-slate-700 whitespace-pre-wrap text-slate-600 font-normal capitalize">
                {n?.content}
              </p>
              <p className="text-sm dark:text-slate-900 flex justify-start items-center gap-1 border-l-2 p-1 rounded-md dark:bg-stone-500 bg-slate-100 border-slate-500 text-slate-600 font-normal">
                <Clock width={18} height={18} />{" "}
                {dayjs(n?.createdAt).format("hh:mm A")}
              </p>
            </div>
            <div className="flex justify-start h-full items-start gap-2">
              <UpdateNote
                userId={userId}
                initialNote={{
                  id: n.id, // Ensure that `id` is properly assigned
                  title: n.title,
                  content: n.content,
                }}
                onUpdateSuccess={fetchNotes}
              />
              <DeleteConfirmationDialog
                noteId={n?.id}
                onDeleteSuccess={fetchNotes}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GetNotes;
