import { IPatients } from '../../database/drivers/mongoose/model/Patients';

import PatientsRepository from "../../database/drivers/mongoose/repositories/PatientsRepository";

import { IDeletePatient } from '../../interfaces';

import AppExcepiton from '../../errors/AppException';
import DeleteSessionService from '../SessionsServices/DeleteSessionService';

class DeletePatientsService{
    private PatientsRepository;

    constructor(){
        this.PatientsRepository = new PatientsRepository();
    }

    public async exec({ id }: IDeletePatient): Promise<any>{
        let patient: IPatients | null;
        let sessionsPatient;
        
        try{
            patient = await this.PatientsRepository.deletePatientById({ id });
            sessionsPatient = await DeleteSessionService.byField({patient: id});
        }catch (error){
            throw new AppExcepiton('Error error delete patient');
        }

        if(!patient)
            throw new AppExcepiton('Patient does not existe');
        
        return { patient, sessions_del: sessionsPatient.info.deletedCount};
    }
}

export default new DeletePatientsService();
