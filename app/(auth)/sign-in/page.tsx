"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth/auth-client";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/lib/toast";

// Validation schema
const signInSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: SignInFormValues) {
        setIsLoading(true);

        try {
            const result = await signIn.email({
                email: values.email,
                password: values.password,
            });

            console.log("[SIGN IN] Result:", result); // DEBUG

            if (result.error) {
                // ✅ Error toast with specific message
                if (result.error.message?.includes('credentials')) {
                    toast.error("Invalid credentials", "Please check your email and password");
                } else {
                    toast.error("Login failed", result.error.message || "Please try again");
                }
                setIsLoading(false);
                return;
            }

            console.log("[SIGN IN] Success!");

            // ✅ Success toast (no need to wait for name, just show generic message)
            toast.success("Welcome back!", "NutriLog missed you.");

            // Wait a bit for cookies to be set
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect
            window.location.href = callbackUrl;
        } catch (err: any) {
            console.error("[SIGN IN] Error:", err);
            // ✅ Error toast for unexpected errors
            toast.error("Unexpected error", "Please try again or contact support");
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                <h1 className="form-title h1">Welcome Back!</h1>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <div className="shad-form-item">
                                <FormLabel className="shad-form-label body-2 ">Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="you@example.com" className="shad-input shad-no-focus body-2" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage className="shad-form-message body-2" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="shad-form-item">
                                <FormLabel className="shad-form-label body-2">Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••" className="shad-input shad-no-focus body-2" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage className="shad-form-message body-2" />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="button primary-btn h-[66px]" disabled={isLoading}>
                    Log In
                    {isLoading && (
                        <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin" />
                    )}
                </Button>

                <div className="body-2 flex justify-center">
                    <p className="text-light-100">
                        Don&apos;t have an account?
                    </p>
                    <Link href={"/sign-up"} className="ml-1 font-medium text-brand">
                        Sign Up
                    </Link>
                </div>
            </form>
        </Form>
    );
}
