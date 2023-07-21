import { Request, Response } from 'express';
import CreateDeviceService from '../../services/DeviceServices/CreateDeviceService';
import ReadDeviceService from '../../services/DeviceServices/ReadDeviceService';

class DeviceController{

    public async create(request: Request, response: Response): Promise<Response> {
        const device = await CreateDeviceService.exec(
            request.body
        );

        return response.status(201).json(device);
    }

    public async filterAllDevices(request: Request, response: Response): Promise<Response> {
        const devices = await ReadDeviceService.all();

         return response.status(201).json({ devices });
    }

    public async filterDevice(request: Request, response: Response): Promise<Response> {
        const devices = await ReadDeviceService.byId(request.params.id);

         return response.status(201).json({ devices });
    }
}

export default DeviceController;
