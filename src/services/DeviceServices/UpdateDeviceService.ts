import { IDevices } from '../../database/drivers/mongoose/model/Devices';
import { IDeviceWithId } from '../../interfaces';
import DeviceRepository from "../../database/drivers/mongoose/repositories/DeviceRepository";

import AppExcepiton from '../../errors/AppException';

class UpdateDeviceService{
    private DeviceRepository;

    constructor(){
        this.DeviceRepository = new DeviceRepository();
    }

    public async exec({ id, password, description, comments, complex }: IDevices): Promise<IDevices | null>{
        let device: IDevices | null;

        try{
            device = await this.DeviceRepository.updateDeviceById({ id, password, description, comments, complex});
        }catch (error){
            throw new AppExcepiton('Error update device', '5.00');
        }

        if(!device)
            throw new AppExcepiton('Device does not existe', '4.04');


        return device;
    }
}

export default new UpdateDeviceService();
