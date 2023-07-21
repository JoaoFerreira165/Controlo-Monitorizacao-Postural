import mongoose, { ObjectId, Schema } from "mongoose";

export interface IComplex{
    _id?: string; 
    name: string;
    description?: string;
    contactNumbers: [string];
    email?: [string];
    address: string;
    postcode: string;
    district: string;
    county: string;
    town: string;
    coordinates?: [string];
}

const complexSchema = new Schema<IComplex>(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        contactNumbers: {
            type: [String],
            required: true
        },
        email: {
            type: [String],
        },
        address: {
            type: String,
            required: true
        },
        postcode: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        county: {
            type: String,
            required: true
        },
        town: {
            type: String,
            required: true
        },
        coordinates: {
            type: [String],
        },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'complex'
    }
)

export default mongoose.model<IComplex>('Complex', complexSchema);