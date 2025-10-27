"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

const formSchema = z.object({
    username: z.string().min(2).max(50),
    email:z.email(),
    password: z.string().min(6).max(50),
})

type FormType = 'sign-in' | 'sign-up'

const AuthForm = ({ type }: { type: FormType }) => {


    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [accountId, setAccountId] = useState(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password:""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        setErrorMessage("")
        console.log("Form Values:", values)

        // create account
        // try {
        //     const user = type==='sign-up' ? await createAccount({
        //         username: values.username || "", 
        //         email: values.email, 
        //     }): await signInUser({email:values.email})
    
        //     setAccountId(user.accountId)    
            
        // } catch {
        //     setErrorMessage('Failed to create an account. Please try again.')
            
        // } finally{
        //     setIsLoading(false)
        // }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                    <h1 className="form-title h1">
                        {type === "sign-in" ? "Sign In" : "Sign Up"}
                    </h1>
                    {type === "sign-up" && <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                    <FormLabel className="shad-form-label body-2">Username</FormLabel>

                                    <FormControl>
                                        <Input placeholder="Enter your username" className="shad-input shad-no-focus body-2" {...field} />
                                    </FormControl>
                                </div>

                                <FormMessage className="shad-form-message body-2" />
                            </FormItem>
                        )}
                    />}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                    <FormLabel className="shad-form-label body-2 ">Email</FormLabel>

                                    <FormControl>
                                        <Input placeholder="Enter your email" className="shad-input shad-no-focus body-2" {...field} />
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
                                        <Input placeholder="Enter your password" className="shad-input shad-no-focus body-2" {...field} />
                                    </FormControl>
                                </div>

                                <FormMessage className="shad-form-message body-2" />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="button primary-btn h-[66px]" disabled={isLoading}>
                        {type=== "sign-in"? "Sign In" : "Sign Up"}

                        {isLoading &&(
                            <Image src="/assets/icons/loader.svg" alt="loader"width={24}height={24} className="ml-2 animate-spin" />
                        )}
                    </Button>

                    {errorMessage &&
                        <p className="error-message body-2">*{errorMessage}</p>
                    }
                    <div className="body-2 flex justify-center">
                        <p className="text-light-100">
                            {type=== "sign-in"? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <Link href={type=== "sign-in"? "/sign-up": "/sign-in"} className="ml-1 font-medium text-brand">
                        {" "}
                        {type=== "sign-in"? "Sign Up": "Sign In"}

                        </Link>

                    </div>
                </form>
            </Form>
        </>
    )
}

export default AuthForm