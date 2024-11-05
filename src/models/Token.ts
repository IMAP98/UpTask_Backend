import mongoose, { Schema, Types } from "mongoose";

// SECTION: TypeScript
export interface IToken {
    token: string;
    user: Types.ObjectId;
    createdAt: Date;
}

const tokenSchema: Schema = new Schema(
    {
        token: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: "10m",
        }
    },
    {
        timestamps: true
    }
);

const Token = mongoose.model<IToken>("Token", tokenSchema);

export default Token;