"use client";
import { useState, useEffect } from "react";
import bankAnimation from "../../constants/Lottie/bankAnimation.json";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { TRootState } from "@/src/store/redux";
import { setInitialAnimation } from "@/src/features/userData/userDataSlice";
import { motion } from "framer-motion";

const InitialAnimation = () => {
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      exit={{ opacity: 0 }}
      className={cn(
        "w-full h-screen z-10 bg-white",
        isShown ? "flex justify-center items-center" : "hidden"
      )}
    >
      <Lottie animationData={bankAnimation} loop={false} />{" "}
      {/* Optional: set loop to false if needed */}
    </motion.div>
  );
};

export default InitialAnimation;
