import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";

// SECTION: TypeScript
export interface InterfaceProject extends Document {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[];
    manager: PopulatedDoc<IUser & Document>;
    team: PopulatedDoc<IUser & Document>[];
}

// SECTION: Mongoose
const ProjectSchema: Schema = new Schema(
    {
        projectName: {
            type: String,
            required: true,
            trim: true,
        },
        clientName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        tasks: [{ 
            type: Types.ObjectId,
            ref: 'Task',
        }],
        manager: {
            type: Types.ObjectId,
            ref: 'User',
        },
        team: [{ 
            type: Types.ObjectId,
            ref: 'User',
        }],
    }, 
    {
        timestamps: true
    }
);

const Project = mongoose.model<InterfaceProject>('Project', ProjectSchema);

export default Project;
