import mongoose, { Schema } from "mongoose";

export interface ISession{
    id?: string;
    description?: string;
    comments?: string;
    task: Schema.Types.ObjectId | string;
    patient: Schema.Types.ObjectId | string;
    device: Schema.Types.ObjectId | string;
    complex: Schema.Types.ObjectId | string;
    endAt?: Date;
}

const sessionsSchema = new Schema<ISession>(
    {
        description: {
            type: String,
        },
        comments: {
            type: String,
        },
        task:{
            type: Schema.Types.ObjectId,
            ref: 'Tasks',
            required: true
        },
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patients',
            required: true
        },
        device: {
            type: Schema.Types.ObjectId,
            ref: 'Device',
            required: true
        },
        complex: {
            type: Schema.Types.ObjectId,
            ref: 'Device',
            required: true
        },
        endAt: {
            type: Date,
        } 
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'sessions'
    }
)

export default mongoose.model<ISession>('Sessions', sessionsSchema);
