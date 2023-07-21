import { IPatients } from '../../database/drivers/mongoose/model/Patients';

import PatientsRepository from "../../database/drivers/mongoose/repositories/PatientsRepository";

import AppExcepiton from '../../errors/AppException';

class ReadPatientService{
    private PatientsRepository;

    constructor(){
        this.PatientsRepository = new PatientsRepository();
    }

    public async byId(id: string): Promise<IPatients | null>{
        let patient: IPatients | null;

        try{
            patient = await this.PatientsRepository.filterPatientById({
                id
            });
        }catch (error){
            throw new AppExcepiton('Error filter patient by id');
        }

        if(!patient)
            throw new AppExcepiton('Patient ID does not exist');


        return patient;
    }

    public async all(): Promise<IPatients[] | null>{
        let patient: IPatients[] | null;

        try{
            patient = await this.PatientsRepository.filterAllPatient();
        }catch (error){
            throw new AppExcepiton('Error filter all patients');
        }

        return patient;
    }

    
}

export default new ReadPatientService();