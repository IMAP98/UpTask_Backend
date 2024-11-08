import mongoose, { Schema, Types } from "mongoose";

// SECTION: TypeScript
export interface IUser {
    id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    confirmed: boolean;
}


// SECTION: Mongoose
const userSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
    },

);

const User = mongoose.model<IUser>("User", userSchema);

export default User;