import { IPatients } from '../../database/drivers/mongoose/model/Patients';

import PatientsRepository from "../../database/drivers/mongoose/repositories/PatientsRepository";

import { IUpdatePatient } from '../../interfaces'

import AppExcepiton from '../../errors/AppException';

class UpdatePatientService{
    private PatientsRepository;

    constructor(){
        this.PatientsRepository = new PatientsRepository();
    }

    public async exec({ id, name, gender, comments, complex, dateOfBirth }: IUpdatePatient): Promise<IPatients | null>{
        let patient: IPatients | null;

        try{
            patient = await this.PatientsRepository.updatePatientById({
                id,
                name,
                gender,
                comments,
                complex,
                dateOfBirth
            });
        }catch (error){
            throw new AppExcepiton('Error update the patient field');
        }

        if(!patient)
            throw new AppExcepiton('Patient ID does not exist');


        return patient;
    }
}
 
export default new UpdatePatientService();