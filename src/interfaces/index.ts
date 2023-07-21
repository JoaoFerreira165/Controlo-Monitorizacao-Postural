import { IData } from '../database/drivers/mongoose/model/Sessions_Data';
import { Request }  from 'express';
import { Server } from 'socket.io';

// Complex Interfaces
export interface IUpdateComplex{
    id: string;
    name: string;
    description?: string;
    contactNumbers: [string];
    email?: string;
    address: string;
    postcode: string;
    district: string;
    county: string;
    town: string;
    coordinates?: string;
}

// Sessions Interfaces
export interface IUpdateSession{
    id: string;
    description?: string;
    comments?: string;
    task?: string;
    patient?: string;
    deviceName?: string;
    endAt?: Date;
}

export interface ISessionRequestWithId{
    id: string;
    description?: string;
    task: string;
    patient: string;
    device: string;
}

// Patient Interfaces
export interface IUpdatePatient{
    id: string;
    name: string;
    gender: 'M' | 'F' | 'Q';
    comments?: string;
    complex: string;
    dateOfBirth?: number;
}

export interface IDeletePatient{
    id: string
}

// Task Interfaces
export interface IUpdateTask{
    id: string;
    name: string;
    description: string;
    comments: string;
}

// Devices Interfaces
export interface IDeviceWithId{
    id: string;
    password?: string;
    description?: string;
    comments?: string;
    authToken?: string;
    complex?: string;
}

// Device data Interfaces
export interface ISessionDataReceived{
    sessionToken: string, 
    data: IData
}

export interface ISocketParamsRequest extends Request {
    io?: Server,
    connectedUsers?: any
}