import mongoose, { Schema } from "mongoose";
import { IComplex } from "./Complex";

export interface IPatients{
    name: string;
    gender: 'M' | 'F' | 'Q';
    comments: string;
    complex: Schema.Types.ObjectId | string | IComplex;
    dateOfBirth?: number;
}

const patientsSchema = new Schema<IPatients>(
    {
        name: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ['M', 'F', 'Q'],
            required: true
        },
        comments: {
            type: String
        },
        complex: {
            type: Schema.Types.ObjectId,
            ref: 'Complex',
            required: true
        },
        dateOfBirth: {
            type: Number,
            require: false
        }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'patients'
    }
)

export default mongoose.model<IPatients>('Patients', patientsSchema);
 