import mongoose, { Document, Schema, Types } from "mongoose";

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed',
} as const;

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus];

// SECTION: TypeScript
export interface InterfaceTask extends Document {
    name: string;
    description: string;
    project: Types.ObjectId;
    status: TaskStatus;
}

// SECTION: Mongoose
const TaskSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        project: {
            type: Types.ObjectId,
            ref: 'Project',
        },
        status: {
            type: String,
            enum: Object.values(taskStatus),
            default: taskStatus.PENDING,
        }
    }, 
    {
        timestamps: true
    }
);

const Task = mongoose.model<InterfaceTask>('Task', TaskSchema);

export default Task;
