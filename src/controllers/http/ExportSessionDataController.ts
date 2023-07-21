import { Request, Response } from 'express';
import CreateDeviceService from '../../services/DeviceServices/CreateDeviceService';
import ReadDeviceService from '../../services/DeviceServices/ReadDeviceService';

class ExportSessionDataController{

    public async filterAllDevices(request: Request, response: Response): Promise<Response> {
        const devices = await ReadDeviceService.all();

         return response.status(201).json({ devices });
    }
}

export default ExportSessionDataController;
