import jwt from 'jsonwebtoken';
import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { Types } from 'mongoose';
import UserModel from '@/models/user.model';
import TaskModel from '@/models/task.model';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect()

    try {
        const cookie = await cookies().get("auth-token")
        const id = params.id
        let taskId = new Types.ObjectId(id);
        let userId;

        if (!cookie) {
            return Response.json({
                message: "Unauthorized"
            }, { status: 403 })
        }

        const decoded = await jwt.verify(cookie.value, process.env.JWT_SECRET!)

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

        await UserModel.findOneAndUpdate({ _id: userId }, {
            $pull: { tasks: taskId }
        }, { new: true })

        await TaskModel.findByIdAndDelete(taskId)

        const updatedUser = await UserModel.findById(userId).populate('tasks')

        return Response.json({
            message: "Task deleted successfully",
            tasks: updatedUser?.tasks
        }, {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return Response.json({
            message: "Something went wrong while deleting the task"
        }, { status: 500 })
    }
}