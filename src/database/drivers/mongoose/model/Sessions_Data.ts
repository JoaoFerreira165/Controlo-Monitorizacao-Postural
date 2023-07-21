import mongoose, { Schema } from 'mongoose';

export interface IData{
    pitchRotation: number;
    rollRotation: number;
    yawRotation: number;
    tempBNO55: number;
    indexMCU: number;
}

export interface ISessionData {
    sessionId: Schema.Types.ObjectId | string;
    data: IData;
}

const sessionDataSchema = new Schema<ISessionData>(
    {
        sessionId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Sessions"
        },
        data: {
            pitchRotation: {
                type: Number,
                required: true
            },
            rollRotation: {
                type: Number,
                required: true
            },
            yawRotation: {
                type: Number,
                required: true
            }, 
            tempBNO55: {
                type: Number,
                required: true
            },
            indexMCU: {
                type: Number,
                required: true
            }
        },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'sessions_data'
    }
);

export default mongoose.model<ISessionData>('Sessions_Data', sessionDataSchema);
