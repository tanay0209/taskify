import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"
import { Types } from "mongoose";
import UserModel from "@/models/user.model";
import TaskModel from "@/models/task.model";
export async function PATCH(request: NextRequest, { params }: {
    params: {
        id: string
    }
}) {
    await dbConnect()
    try {
        let userId;
        const { title, description, priority, dueDate, status } = await request.json()
        const id = params.id
        const cookie = await cookies().get("auth-token")?.value

        if (!cookie) {
            return Response.json({
                message: "Unauthorized"
            }, { status: 403 })
        }

        const decoded = await jwt.verify(cookie, process.env.JWT_SECRET!)

        if (typeof decoded === "string") {
            return Response.json({
                message: "Incorrect Token"
            }, { status: 401 })
        }

        userId = new Types.ObjectId(decoded.id)

        const updatedTask = await TaskModel.findByIdAndUpdate({ _id: new Types.ObjectId(id) }, {
            title,
            description,
            status,
            dueDate,
            priority,
            userId
        }, { new: true })

        if (!updatedTask) {
            return Response.json({
                message: "Task does not exists"
            }, { status: 404 })
        }

        const user = await UserModel.findById({ _id: userId }).populate('tasks')
        return Response.json({
            message: "Task Updated Successfully",
            tasks: user?.tasks
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({
            message: "Not able to update task"
        }, { status: 500 })
    }
}