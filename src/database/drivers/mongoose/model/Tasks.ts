
import mongoose, { Schema } from "mongoose";

export interface ITasks{
    name: string;
    description: string;
    comments?: string;
}

const tasksSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        comments: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'tasks'
    }
)

export default mongoose.model<ITasks>('Tasks', tasksSchema);
 