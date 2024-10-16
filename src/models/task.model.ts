import mongoose, { Schema } from "mongoose";

enum TaskStatus {
    TODO = "To Do",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed"
}

enum TaskPriority {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High"
}

export type Task = {
    title: string,
    description: string,
    status: TaskStatus,
    priority: TaskPriority,
    dueDate: Date,
    userId: mongoose.Types.ObjectId
}

const TaskSchema = new Schema<Task>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.TODO
    },
    priority: {
        type: String,
        enum: Object.values(TaskPriority),
        default: TaskPriority.LOW
    },
    dueDate: {
        type: Date,
        default: Date.now
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const TaskModel = (mongoose.models.Task as mongoose.Model<Task> || mongoose.model<Task>("Task", TaskSchema));

export default TaskModel;
