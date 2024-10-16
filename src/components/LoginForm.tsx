"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,                
} from "@/components/ui/form"
import Link from "next/link"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const LoginSchema = z.object({
    email: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        }),
    password: z
        .string()
        .min(6, {
            message: "Password should be atleast 6 characters"
        })
})

export function Login() {

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "tanayjagnani@gmail.com",
            password: "12345678"
        }
    })

    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setLoading(true)
        try {
            const response = await axios.post("/api/login", data)
            if (response.status !== 200) {
                toast.error(response.data.message)
            }
            toast.success("Login success")
            router.push('/')
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <Form
            {...form}
        >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    className="w-full"
                                    placeholder="Email" {...field} />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    className="w-full"
                                    placeholder="Password"
                                    {...field} />

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={loading}
                    className="w-full"
                    type="submit">Submit</Button>
            </form>
            <div className="w-full text-center text-gray-500">
                New User? <span className="underline">
                    <Link href='/register'>
                        Register</Link>
                </span>
            </div>
        </Form>
    )
}
