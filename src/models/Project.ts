import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { InterfaceTask } from "./Task";

// SECTION: TypeScript
export interface InterfaceProject extends Document {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<InterfaceTask & Document>[]
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
    }, 
    {
        timestamps: true
    }
);

const Project = mongoose.model<InterfaceProject>('Project', ProjectSchema);

export default Project;