import dbConnect from "@/lib/dbConnect";
import TaskModel from "@/models/task.model";
import UserModel from "@/models/user.model";
import jwt from "jsonwebtoken"
import { Types } from "mongoose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect()
    try {
        const { title, description, status, priority, dueDate } = await request.json()

        if (!title) {
            return Response.json({
                message: "Title is required"
            }, {
                status: 401
            })
        }
        const cookie = cookies().get("auth-token");
        if (!cookie) {
            return Response.json(
                {
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }
        let userId;
        const decoded = jwt.verify(cookie.value, process.env.JWT_SECRET!);
        if (typeof decoded === "string") {
            return Response.json({
                message: "Invalid token format",
            }, { status: 401 });
        }
        userId = new Types.ObjectId(decoded.id);
        const user = await UserModel.findById({ _id: userId })
        if (!user) {
            return Response.json({
                message: "User not found"
            }, { status: 404 })
        }

        const newTask = new TaskModel({
            title,
            description,
            status,
            priority,
            dueDate,
            userId
        })
        await newTask.save()
        await user.tasks.push(newTask._id)
        await user.save()

        const updatedUser = await UserModel.findById(userId).populate('tasks')
        return Response.json({
            message: "Task created successfully",
            tasks: updatedUser?.tasks
        }, { status: 201 });

    } catch (error: any) {
        return Response.json({
            message: "An error occurred",
            error: error.message
        }, { status: 500 });
    }
}