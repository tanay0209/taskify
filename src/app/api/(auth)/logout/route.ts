import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const cookie = cookies().get("auth-token");
        if (!cookie) {
            return Response.json({
                message: "No active session found. User is already logged out."
            }, { status: 400 });
        }

        cookies().delete("auth-token");

        return Response.json({
            message: "User logged out successfully."
        }, { status: 200 });
    } catch (error) {
        console.error("Error logging out user:", error);
        return Response.json({
            message: "Error logging out user."
        }, { status: 500 });
    }
}
