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
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Input } from "../../ui/input";
import Image from "next/image";
import { Compare } from "../../ui/compare";

import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TErrorResponse } from "@/src/types";
import { toast } from "react-hot-toast";
import { getLoggedInUser, signUp } from "@/src/utils/actions/user.actions";
import { useDispatch } from "react-redux";
import { setUser } from "@/src/features/userData/userDataSlice";
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
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long." }),
  state: z
    .string()
    .min(2, { message: "State must be at least 2 characters long." }),
  postCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, { message: "Enter a valid postal code." }), //12345-6789
  birthDate: z.string(),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, {
    message: "Enter a valid SSN (e.g., 123-45-6789).", //123-45-6789
  }),
});

const SignUpPage = () => {
  // const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

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
      const newUser = await signUp(values);
      dispatch(setUser(newUser));
      setLoading(false);
      form.reset();
      router.push("/sign-in");
    } catch (error) {
      const errr = error as TErrorResponse;
      toast.error(errr.message, {
        position: "bottom-right",
      });
    }
  }
  return (
    <section className="flex w-full h-screen justify-center items-center">
      <div className="w-1/2 max-sm:w-full bg-white gap-4 max-sm:gap-2 flex flex-col justify-center items-center">
        <header className=" flex flex-col justify-start items-start gap-3 max-sm:gap-2 w-[420px] max-sm:w-[350px]">
          <div className="flex-center gap-2">
            <Image src={"/icons/logo.png"} alt="logo" width={34} height={34} />
            <h1 className="font-bold text-2xl text-sky-950">Bank_Logo</h1>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <h1 className="header-box-title">Sign Up</h1>
            <p className="header-box-subtext">Please enter your details.</p>
          </div>
        </header>
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
                          className="placeholder:text-gray-500 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
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
                          className="placeholder:text-gray-500 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                        />
                      </FormControl>
                      <FormMessage className="form-message" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your spescific address"
                        {...field}
                        className="placeholder:text-gray-500 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[460px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
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
                          className="placeholder:text-gray-500 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
                        />
                      </FormControl>
                      <FormMessage className="form-message" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex: 12345-6789"
                          {...field}
                          className="placeholder:text-gray-500 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
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
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger
                            asChild
                            className="max-sm:flex max-sm:justify-center max-sm:items-center"
                          >
                            <Button
                              variant={"outline"}
                              className={cn(
                                "max-sm:w-[360px] w-[221px] border border-gray-300  justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              {date ? (
                                format(date, "yyyy-MM-dd")
                              ) : (
                                <span className="text-gray-500 text-base font-normal">
                                  yyyy-mm-dd
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto bg-white z-10 p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(selectedDate) => {
                                setDate(selectedDate);
                                field.onChange(
                                  selectedDate
                                    ? format(selectedDate, "yyyy-MM-dd")
                                    : ""
                                );
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                          className="placeholder:text-gray-500 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[221px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
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
                          className="placeholder:text-gray-500 placeholder:text-base placeholder:font-normal max-sm:w-[360px] w-[460px] focus-visible:outline-none focus:border-none focus:ring-1 focus:ring-blue-500 border border-gray-300 shadow-sm"
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
              </div>
              <div className="w-full  max-sm:w-[360px] flex justify-center items-center flex-col gap-1">
                <Button
                  disabled={loading}
                  type="submit"
                  className="form-btn w-full !mt-2"
                >
                  {loading ? <Loader /> : "Sign Up"}
                </Button>
                <h2 className="flex text-slate-600 text-sm font-normal justify-center items-center gap-1">
                  Have an account?
                  <Link href={"/sign-in"} className="form-link">
                    Login
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

export default SignUpPage;
