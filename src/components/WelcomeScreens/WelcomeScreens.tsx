"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { SiderbarProps } from "@/src/types";

const WelcomeScreens = ({ user }: SiderbarProps) => {
  const [open, setOpen] = useState(false);
  const [randomQuote, setRandomQuote] = useState("");
  const [randomImage, setRandomImage] = useState("");

  const quotes = [
    "Financial freedom is not a distant dream. It's a decision you make today.",
    "Your money should work for you, not the other way around.",
    "A journey to wealth starts with a single step.",
    "Savings today, security tomorrow.",
    "Small steps towards big financial goals.",
  ];
  const images = [
    "/icons/money-bag.png",
    "/icons/smartphone.png",
    "/icons/moremoney.png",
    "/icons/money.png",
    "/icons/salary.png",
  ];

  const getRandomContent = () => {
    const getRandomQuote = Math.floor(Math.random() * quotes.length);
    const getRandomImage = Math.floor(Math.random() * images.length);

    setRandomQuote(quotes[getRandomQuote]);
    setRandomImage(images[getRandomImage]);
  };

  useEffect(() => {
    getRandomContent();
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white dark:border-stone-400 dark:bg-stone-600">
        <DialogTitle className="dark:text-neutral-950 capitalize">
          Welcome {user?.firstName}
        </DialogTitle>
        <DialogDescription className="text-center flex flex-col justify-center items-center gap-1">
          {/* Display the random image */}
          <Image
            src={randomImage}
            width={50}
            height={50}
            alt="Welcome Icon"
            className="mx-auto mb-4"
          />
          {/* Display the random quote */}
          <p className="text-lg font-semibold text-gradient capitalize">
            {randomQuote}
          </p>
        </DialogDescription>
        <DialogFooter>
          <Button
            className="w-full dark:bg-stone-700 dark:text-neutral-950 flex justify-center items-center"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeScreens;
