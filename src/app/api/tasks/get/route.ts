import jwt from 'jsonwebtoken';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    await dbConnect()

    try {
        const cookie = cookies().get("auth-token")?.value;
        let userId;
        if (!cookie) {
            return Response.json({
                message: "Unauthorized"
            }, { status: 403 })
        }

        const decoded = await jwt.verify(cookie, process.env.JWT_SECRET!)

        if (typeof decoded === "string") {
            return Response.json({
                message: "Incorrect token"
            }, { status: 401 })
        }
        userId = new mongoose.Types.ObjectId(decoded.id)

        const user = await UserModel.findById({ _id: userId })

        if (!user) {
            return Response.json({
                message: "User does not exists"
            }, { status: 404 })
        }
        await user.populate('tasks')
        return Response.json({
            message: "Tasks fetched successfully",
            tasks: user.tasks
        }, { status: 200 })

    } catch (error) {
        console.log(error);
        return Response.json({
            message: "Error while retrieving tasks"
        }, { status: 500 })
    }
}