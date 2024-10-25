"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";
import Image from "next/image";
import { Compare } from "../../ui/compare";

import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { TErrorResponse } from "@/src/types";
import { toast } from "react-hot-toast";
import { signUp } from "@/src/utils/actions/user.actions";

import PlaidLink from "./PlaidLink";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";

import bank1 from "./Lottie/bank1.json";

const formSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters." })
    .email({ message: "Enter a valid email address." }),
  password: z.string(),
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters long." }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters long." }),
  address1: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long." }),
  city: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long." }),
  state: z
    .string()
    .min(2, { message: "State must be at least 2 characters long." }),
  postalCode: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
});

const SignUpPage = () => {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const userData = {
        firstName: values.firstName!,
        lastName: values.lastName!,
        address1: values.address1!,
        city: values.city!,
        state: values.state!,
        postalCode: values.postalCode!,
        dateOfBirth: values.dateOfBirth!,
        ssn: values.ssn!,
        email: values.email!,
        password: values.password!,
      };
      const newUser = await signUp(userData);
      setUser(newUser);
      console.log(user);
    } catch (error) {
      const errr = error as TErrorResponse;
      toast.error(errr.message, {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="flex dark:bg-stone-500 w-full h-screen justify-center items-center">
      <div
        className={cn(
          "w-1/2 max-sm:w-full bg-white dark:bg-stone-500 gap-4 max-sm:gap-2 flex justify-center items-center flex-col"
        )}
      >
        <header className=" flex flex-col justify-start items-start gap-3 max-sm:gap-2 w-[420px] max-sm:w-[350px]">
          <div className="flex-center gap-2">
            <Image src={"/icons/logo.png"} alt="logo" width={34} height={34} />
            <h1 className="font-bold text-2xl text-sky-950">NexPay</h1>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <h1 className="header-box-title">
              {user ? "Link Account" : "Sign Up"}
            </h1>
            <p className="header-box-subtext">
              {user
                ? "Link your account to get started."
                : "Please enter your details."}
            </p>
          </div>
        </header>
        {user ? (
          <div className="flex flex-col gap-4 w-[420px] max-sm:w-[350px]">
            <PlaidLink user={user} variant={"primary"} />
          </div>
        ) : (
          <div className="max-sm:justify-center max-sm:items-center flex justify-start items-start  w-[420px] max-sm:w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 max-sm:flex max-sm:justify-center max-sm:items-center max-sm:flex-col "
              >
                <div className="flex max-sm:flex-col justify-center items-center gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-label">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mohammed"
                            {...field}
                            className="placeholder:text-gray-500 focus-visible:dark:ring-offset-0 dark:bg-stone-400 dark:border-slate-900 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="form-message" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-label">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Karim"
                            {...field}
                            className="placeholder:text-gray-500 focus-visible:dark:ring-offset-0 dark:bg-stone-400 dark:border-slate-900 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="form-message" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your spescific address"
                          {...field}
                          className="placeholder:text-gray-500 focus-visible:dark:ring-offset-0 dark:bg-stone-400 dark:border-slate-900 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[460px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                        />
                      </FormControl>
                      <FormMessage className="form-message" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your city"
                          {...field}
                          className="placeholder:text-gray-500 focus-visible:dark:ring-offset-0 dark:bg-stone-400 dark:border-slate-900 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[460px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                        />
                      </FormControl>
                      <FormMessage className="form-message" />
                    </FormItem>
                  )}
                />
                <div className="flex max-sm:flex-col justify-center items-center gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-label">State</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: NY"
                            {...field}
                            className="placeholder:text-gray-500 focus-visible:dark:ring-offset-0 dark:bg-stone-400 dark:border-slate-900 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="form-message" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-label">
                          Postal Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: 12345"
                            {...field}
                            className="placeholder:text-gray-500 focus-visible:dark:ring-offset-0 dark:bg-stone-400 dark:border-slate-900 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="form-message" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex max-sm:flex-col justify-center items-center gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-label">
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="YYYY-MM-DD"
                            {...field}
                            className="placeholder:text-gray-500 focus-visible:dark:ring-offset-0 dark:bg-stone-400 dark:border-slate-900 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="form-message" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ssn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-label">SSN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: 1234"
                            {...field}
                            className="placeholder:text-gray-500 focus-visible:dark:ring-offset-0 dark:bg-stone-400 dark:border-slate-900 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="form-message" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2 justify-start items-start ">
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
                            className="placeholder:text-gray-500 focus-visible:dark:ring-offset-0 dark:bg-stone-400 dark:border-slate-900 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[460px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
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
                          <div className="relative max-sm:w-[360px] w-[460px]">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              {...field}
                              className="placeholder:text-gray-500 focus-visible:dark:ring-offset-0 dark:bg-stone-400 dark:border-slate-900  placeholder:text-base placeholder:font-normal w-full pr-10 focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
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
                                <EyeOff
                                  size={20}
                                  className="dark:text-gray-800"
                                />
                              ) : (
                                <Eye size={20} className="dark:text-gray-800" />
                              )}
                            </motion.div>
                          </div>
                        </FormControl>
                        <FormMessage className="form-message" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full  max-sm:w-[360px] flex justify-center items-center flex-col gap-1">
                  <Button
                    disabled={loading}
                    type="submit"
                    className="form-btn w-full !mt-2 dark:text-slate-900"
                  >
                    {loading ? (
                      <Loader
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                  <h2 className="flex text-slate-600 text-sm font-normal justify-center items-center gap-1">
                    Have an account?
                    <Link
                      href={`/sign-in`}
                      className="form-link dark:text-slate-900"
                    >
                      Login
                    </Link>
                  </h2>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
      <div className="w-1/2 max-sm:hidden dark:bg-stone-500 bg-sky-50 h-full flex justify-center items-center">
        {/* <div className="size-full px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
          <div className="p-1 md:p-2  rounded-3xl dark:bg-neutral-900 bg-neutral-100   dark:border-neutral-800 mx-auto size-full">
            <Compare
              firstImage={`${()}`}
              secondImage={`${(<Lottie animationData={bank2} />)}`}
              firstImageClassName="object-cover object-left-top w-full"
              secondImageClassname="object-cover object-left-top w-full"
              className="w-full h-full rounded-[22px] md:rounded-lg"
              slideMode="hover"
              autoplay={true}
            />
          </div>
        </div> */}
        <Lottie animationData={bank1} loop={true} />
      </div>
    </section>
  );
};

export default SignUpPage;
