import { ISession } from '../../database/drivers/mongoose/model/Sessions';
import { IDevices } from '../../database/drivers/mongoose/model/Devices';

import SessionsRepository from "../../database/drivers/mongoose/repositories/SessionsRepository";

import ReadSessionService from "../../services/SessionsServices/ReadSessionService";
import ReadDeviceService from "../../services/DeviceServices/ReadDeviceService";

import { IUpdateSession } from '../../interfaces'

import AppExcepiton from '../../errors/AppException';

import { listOfObservers } from '../../controllers/coap/DeviceController';

class UpdateSessionService{
    private SessionsRepository;

    constructor(){
        this.SessionsRepository = new SessionsRepository();
    }

    public async byId({ id, description, comments, task, patient, deviceName, endAt }: IUpdateSession): Promise<ISession | null>{
        let session: ISession | null;
  
        try{
            session = await this.SessionsRepository.updateSessionById({
                id,
                description,
                comments,
                task,
                patient,
                deviceName,
                endAt
            });
        }catch (error){
            throw new AppExcepiton('Error update the read field');
        }

        if(!session)
            throw new AppExcepiton('ID does not exist');


        return session;
    }    

    public async atEnd_byId({ sessionId, deviceId } : { sessionId: string, deviceId: string }): Promise<ISession | null>{
        let session: ISession | undefined;
        let sessionUpdated: ISession | null;

        await ReadSessionService.byId(sessionId);
        await ReadDeviceService.byId(deviceId);

        await ReadSessionService.unfinishedSessions().then((unfinishedSessions) => {
            session = unfinishedSessions.find(session => session.id == sessionId);
            
            if(session == null)
                throw new AppExcepiton('Session already terminated');
            else
                if(deviceId != session.device)
                    throw new AppExcepiton('Association between Session ID and device id');
        });
        
        if(listOfObservers[deviceId]){
            try{
                sessionUpdated = await this.SessionsRepository.updateSessionById({
                    id: sessionId,
                    endAt: new Date()
                });
    
                const payload = {
                    message: 'Session has ended',
                    url: 'stopsession'
                }
    
                listOfObservers[deviceId].write(JSON.stringify(payload))
    
            }catch (error){
                throw new AppExcepiton(`Error filter session unfinished`);
            }   

            return sessionUpdated;
        }else{
            throw new AppExcepiton('Device is not found as observer');
        }
    }
}

export default new UpdateSessionService();