"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth/auth-client";

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
const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: SignUpFormValues) {
        setError("");
        setIsLoading(true);

        try {
            const result = await signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
            });

            if (result.error) {
                setError(result.error.message || "Sign up failed");
            } else {
                // Success! Redirect to dashboard
                router.push("/dashboard");
                router.refresh();
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
                <h1 className="form-title h1">Sign Up</h1>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <div className="shad-form-item">
                                <FormLabel className="shad-form-label body-2">Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your username" className="shad-input shad-no-focus body-2" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage className="shad-form-message body-2" />
                        </FormItem>
                    )}
                />

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
                    Sign Up

                    {isLoading && (
                        <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin" />
                    )}
                </Button>
                {error && <p className="text-red-600 text-sm">{error}</p>}


                <div className="body-2 flex justify-center">
                    <p className="text-light-100">
                        Already have an account?
                    </p>
                    <Link href={"/sign-in"} className="ml-1 font-medium text-brand">
                        Sign In
                    </Link>

                </div>
            </form>
        </Form>
    );
}
