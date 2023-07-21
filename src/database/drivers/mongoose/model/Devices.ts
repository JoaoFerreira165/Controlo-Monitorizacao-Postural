import mongoose, { Schema, Types } from 'mongoose';
import { IComplex } from './Complex';


export interface IDevices {
    id?: string;
    description?: string;
    comments?: string;
    password: string;
    complex: Schema.Types.ObjectId | string | IComplex;
}

const devicesSchema = new Schema<IDevices>(
    {
        description: {
            type: String
        },
        comments: {
            type: String
        },
        password: {
            type: String,
            required: true
        },
        complex: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Complex',
        }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'devices'
    }
);


export default mongoose.model<IDevices>('Device', devicesSchema);
