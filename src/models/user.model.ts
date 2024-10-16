import mongoose, { Schema } from "mongoose"
import TaskModel from "./task.model"


type User = {
    username: string,
    email: string,
    password: string,
    tasks: mongoose.Types.ObjectId[]
}

const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: TaskModel,
    }],

}, { timestamps: true })


const UserModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema))

export default UserModel