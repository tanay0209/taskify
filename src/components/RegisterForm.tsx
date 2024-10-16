"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import axios from "axios"
import Link from "next/link"

const RegitserSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        }),
    email: z
        .string()
        .min(1, { "message": "This field has to be fillder" })
        .email("This is not a valid email"),
    password: z
        .string()
        .min(6, "Password shoud be at least 6 characters")
})

export function Register() {
    const form = useForm<z.infer<typeof RegitserSchema>>({
        resolver: zodResolver(RegitserSchema),
        defaultValues: {
            username: "Tanay",
            email: "jagnanitanay@gmail.com",
            password: "12345678"
        }
    })
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async (data: z.infer<typeof RegitserSchema>) => {
        setLoading(true)
        try {
            const response = await axios.post("/api/register", data)
            if (response.status !== 200) {
                toast.error(response.data.message)
            }
            toast.success(response.data.message)
            router.push('/login')
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                Existing User? <span className="underline">
                    <Link href='/login'>
                        Login</Link>
                </span>
            </div>
        </Form>
    )
}
