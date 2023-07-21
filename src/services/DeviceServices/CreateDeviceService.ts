import AppExcepiton from '../../errors/AppException';

import { IDevices } from '../../database/drivers/mongoose/model/Devices';
import deviceRepository from '../../database/drivers/mongoose/repositories/DeviceRepository';

import complexRepository from '../../database/drivers/mongoose/repositories/ComplexRepository';

class CreateDeviceService {
  private deviceRepository; 
  private complexRepository;
  
  constructor(){
    this.deviceRepository = new deviceRepository();
    this.complexRepository = new complexRepository();
  }
  
  public async exec({ password, description, comments, complex }: IDevices): Promise<IDevices>{
    
    const complexObj = await this.complexRepository.filterComplexById(complex as string);
    
    if(!complexObj)
      throw new AppExcepiton('Complex ID does not exist');
    
    return await this.deviceRepository.createDevice({ password, description, comments, complex });
    
  }
}

export default new CreateDeviceService();
