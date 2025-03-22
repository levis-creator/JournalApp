"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { ENDPOINTS } from "@/lib/ApiUrl";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*(),.?\":{}|<>]/, "Must contain at least one special character"),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.AUTH.SIGNUP, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Sign-up failed");
      }

      toast.success("Sign-up successful!");
      router.push("/signin");

    } catch (error) {
      console.log(error)
      // @ts-expect-error: Ignoring TypeScript error for unknown error type
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-5">
      <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
        <ChevronLeftIcon /> Back to dashboard
      </Link>
      <h1 className="text-xl font-semibold mt-5">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" {...register("firstName")} autoFocus />
            <p className="text-red-500 text-sm">{errors.firstName?.message}</p>
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" {...register("lastName")} />
            <p className="text-red-500 text-sm">{errors.lastName?.message}</p>
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>
        <div>
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} {...register("password")} />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
            </span>
          </div>
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>
        <div className="flex items-center">
          <Checkbox id="agreeToTerms" {...register("agreeToTerms")} />
          <label htmlFor="agreeToTerms" className="ml-2">
            I agree to the <Link href="/terms" className="text-brand-500">Terms</Link> & <Link href="/privacy" className="text-brand-500">Privacy Policy</Link>
          </label>
        </div>
        <p className="text-red-500 text-sm">{errors.agreeToTerms?.message}</p>
        <button
          type="submit"
          className="w-full bg-brand-500 text-white py-3 rounded-lg hover:bg-brand-600"
          disabled={isSubmitting || loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account? <Link href="/signin" className="text-brand-500">Sign In</Link>
      </p>
    </div>
  );
}
