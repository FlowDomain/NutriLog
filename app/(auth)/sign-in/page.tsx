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
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: SignInFormValues) {
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn.email({
                email: values.email,
                password: values.password,
            });

            console.log("[SIGN IN] Result:", result); // DEBUG

            if (!result.error) {
                console.log("[SIGN IN] Success!");
                console.log("[SIGN IN] Checking cookies...");

                // Get all cookies
                const allCookies = document.cookie.split(';').map(c => {
                    const [name, value] = c.trim().split('=');
                    return { name, hasValue: !!value };
                });

                console.log("[SIGN IN] All browser cookies:", allCookies);

                // Find session cookie
                const sessionCookie = allCookies.find(c =>
                    c.name.includes('session') ||
                    c.name.includes('auth') ||
                    c.name.includes('token')
                );

                console.log("[SIGN IN] Session cookie:", sessionCookie);

                // Wait for cookie
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Now call debug endpoint
                console.log("[SIGN IN] Calling debug endpoint...");
                const debugResponse = await fetch('/api/debug-cookies');
                const debugData = await debugResponse.json();
                console.log("[SIGN IN] Server sees cookies:", debugData);

                // Redirect
                window.location.href = callbackUrl;
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
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
                {error && <p className="text-red-600 text-sm">{error}</p>}

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
