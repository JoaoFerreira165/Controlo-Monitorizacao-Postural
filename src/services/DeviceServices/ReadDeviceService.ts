import AppExcepiton from '../../errors/AppException';

import { IDevices } from '../../database/drivers/mongoose/model/Devices';

import deviceRepository from '../../database/drivers/mongoose/repositories/DeviceRepository';

import { sign, verify, JwtPayload } from 'jsonwebtoken';

class ReadDeviceService {
    private deviceRepository; 
    
    constructor(){
        this.deviceRepository = new deviceRepository();
    }
    
    public async auth(id: string, password: string, url: string ): Promise<any>{
        const device = await this.deviceRepository.filterDeviceById(id);
        
        if(!device){
            throw new AppExcepiton('Device ID does not exist', '4.04', 0x131);
        }
        
        if(device.password !== password)
            throw new AppExcepiton('Incorrect password', '4.01', 0x132);
        
        const authToken = sign({}, process.env.SECRET!, { 
            subject: device.id,
            expiresIn: process.env.TOKEN_EXPIRE! 
        });

        
        //await UpdateDeviceService.exec({ id, ip });

        return { message: "Authentication done successfully", url, authToken, responseCode: 0x00 };
    }
    
    public async verifyAuthToken(token: string): Promise<any>{
        try {
            const validateToken: JwtPayload = verify(token, process.env.SECRET!) as JwtPayload;

            if(!validateToken.sub)
                throw new AppExcepiton('There is no id available in the received token', '4.04', 0x130);
            
            //await UpdateDeviceService.exec({ id: validateToken.sub, ip });
            
            return { message:"Token validated successfully", validateToken, responseCode: 0x01 };
        } catch {
            throw new AppExcepiton('Invalid token', '4.06', 0x129);
        }
    }

    public async byId(id: string): Promise<IDevices | null>{
        let device: IDevices | null;

        try{
            device = await this.deviceRepository.filterDeviceById(
                id
            );
        }catch (error){
            throw new AppExcepiton('Error filter device by id');
        }

        if(!device)
            throw new AppExcepiton('Device ID does not exist');


        return device;
    }

    public async all(): Promise<IDevices[] | null>{
        let devices: IDevices[] | null;

        try{
            devices = await this.deviceRepository.filterAllDevices();
        }catch (error){
            throw new AppExcepiton('Error filter patient by id');
        }

        return devices;
    }
    
}

export default new ReadDeviceService();
