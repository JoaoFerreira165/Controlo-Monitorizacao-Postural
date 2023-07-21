import Device, { IDevices } from '../model/Devices';
import { IDeviceWithId } from '../../../../interfaces'

class DeviceRepository {

    private deviceRepository;

    constructor() {
      this.deviceRepository = Device;
    }

    public async createDevice({ password, description, comments, complex }: IDevices): Promise<IDevices> {
      return await (await this.deviceRepository.create({ password, description, comments, complex })).populate('complex');
    }

    public async filterDeviceById(id: string): Promise<IDevices | null> {
      return await this.deviceRepository.findById(id);
    }

    public async filterAllDevices(): Promise<IDevices[] | null>{
      return await this.deviceRepository.find();
    };

    public async updateDeviceById({ id, password, description, comments, complex }: IDevices): Promise<IDevices | null>{
      return await this.deviceRepository.findByIdAndUpdate({
          _id: id,
      },
      {
          password,
          description,
          comments,
          complex
      },
      {
          new: true, // Retorna o o objeto atualizado
          runValidators: true
      }
      );
  };

}

export default DeviceRepository;