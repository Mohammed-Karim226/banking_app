"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import Image from "next/image";
import { Compare } from "../../ui/compare";
import toast from "react-hot-toast";

import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TErrorResponse } from "@/src/types";
import { useRouter } from "next/navigation";
import { signIn } from "@/src/utils/actions/user.actions";
const formSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters." })
    .email({ message: "Enter a valid email address." }),
  password: z.string(),
});

const SignInPage = () => {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await signIn({
        email: values?.email,
        password: values?.password,
      });
      response && router.push("/");
      setLoading(false);
      form.reset();
    } catch (error) {
      const err = error as TErrorResponse;
      toast.error(err.message, { position: "bottom-right" });
    }
  }
  return (
    <section className="flex w-full h-screen justify-center items-center">
      <div className="w-1/2 max-sm:w-full bg-white gap-12 flex flex-col justify-center items-center">
        <header className=" flex flex-col justify-start items-start gap-6 w-[420px] max-sm:w-[350px]">
          <div className="flex-center gap-2">
            <Image src={"/icons/logo.png"} alt="logo" width={34} height={34} />
            <h1 className="font-bold text-2xl text-sky-950">Bank_Logo</h1>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <h1 className="header-box-title">Login</h1>
            <p className="header-box-subtext">
              Welcome back! Please enter your details.
            </p>
          </div>
        </header>
        <div className="max-sm:justify-center max-sm:items-center flex justify-start items-start  w-[420px] max-sm:w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email@io.com"
                        {...field}
                        className="placeholder:text-gray-500 placeholder:text-base placeholder:font-normal w-[360px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage className="form-message" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Password</FormLabel>
                    <FormControl>
                      <div className="relative w-[360px]">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          className="placeholder:text-gray-500 placeholder:text-base placeholder:font-normal w-full pr-10 focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.2 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </motion.div>
                      </div>
                    </FormControl>
                    <FormMessage className="form-message" />
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-center items-center flex-col gap-1">
                <Button
                  disabled={loading}
                  type="submit"
                  className="form-btn w-full !mt-6"
                >
                  {loading ? <Loader /> : "Login"}
                </Button>
                <h2 className="flex text-slate-600 text-sm font-normal justify-center items-center gap-1">
                  Don’t have an account?
                  <Link href={"/sign-up"} className="form-link">
                    Sign Up
                  </Link>
                </h2>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="w-1/2 max-sm:hidden bg-sky-50 h-screen flex justify-center items-center">
        <div className="w-full h-[60vh] px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
          <div
            style={{
              transform: "rotateX(10deg) translateZ(80px)",
            }}
            className="p-1 md:p-2 border rounded-3xl dark:bg-neutral-900 bg-neutral-100  border-neutral-200 dark:border-neutral-800 mx-auto w-3/4 h-1/2 md:h-3/4"
          >
            <Compare
              firstImage="https://assets.aceternity.com/notes-dark.png"
              secondImage="https://assets.aceternity.com/linear-dark.png"
              firstImageClassName="object-cover object-left-top w-full"
              secondImageClassname="object-cover object-left-top w-full"
              className="w-full h-full rounded-[22px] md:rounded-lg"
              slideMode="hover"
              autoplay={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;