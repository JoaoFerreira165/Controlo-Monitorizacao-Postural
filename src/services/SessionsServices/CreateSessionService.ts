import { ISession } from '../../database/drivers/mongoose/model/Sessions';
import SessionsRepository from "../../database/drivers/mongoose/repositories/SessionsRepository";

import ReadSessionService from "../../services/SessionsServices/ReadSessionService";
import ReadTaskService from "../../services/TasksServices/ReadTaskService";
import ReadPatientsService from "../../services/PatientsServices/ReadPatientsServices";
import ReadDeviceService from "../../services/DeviceServices/ReadDeviceService";

import AppExcepiton from '../../errors/AppException';
import { listOfObservers } from '../../controllers/coap/DeviceController';

import { sign } from 'jsonwebtoken';
import ReadComplexService from '../ComplexServices/ReadComplexService';
import { IComplex } from '../../database/drivers/mongoose/model/Complex';
import { IPatients } from '../../database/drivers/mongoose/model/Patients';
import { IDevices } from '../../database/drivers/mongoose/model/Devices';

class CreateSessionService{
    private SessionsRepository;

    constructor(){
        this.SessionsRepository = new SessionsRepository();
    }

    public async exec({ description, comments, task, patient, device, complex }: ISession): Promise<ISession>{
        let session: ISession;

        await ReadTaskService.byId(task as string);
        await ReadComplexService.byId(complex as string);
        const patient_data = await ReadPatientsService.byId(patient as string);
        const device_data = await ReadDeviceService.byId(device as string);


        if((patient_data!.complex as IComplex)._id != complex || (device_data!.complex as IComplex)._id != complex){
            throw new AppExcepiton('Device complex or pacient complex does not match with declared complex in the request');
        }

        if(!(await ReadSessionService.unfinishedSessions()).length){
            if(listOfObservers[device as string]){
                try {
                    session = await this.SessionsRepository.createSession({
                        description,
                        comments,
                        task,
                        patient,
                        device,
                        complex
                    });
                } catch (error) {
                    throw new AppExcepiton('Error create the session');
                }

                // Enviado para o device
                const sessionToken = sign({ session_id: session.id }, process.env.SECRET!, { 
                    subject: device as string,
                    expiresIn: process.env.TOKEN_EXPIRE!
                });
                
                const payload = {
                    message: 'A session has been created',
                    url: 'newsession',
                    sessionToken
                }

                listOfObservers[device as string].write(JSON.stringify(payload));

                return session;
            }else{
               throw new AppExcepiton('Device is not found as observer');
            }
        }else{
            throw new AppExcepiton('There are sessions running');
        }
    }
}

export default new CreateSessionService();