import { IPatients } from '../../database/drivers/mongoose/model/Patients';

import PatientsRepository from "../../database/drivers/mongoose/repositories/PatientsRepository";

class CreatePatientsService{
    private PatientsRepository;

    constructor(){
        this.PatientsRepository = new PatientsRepository();
    }

    public async exec({ name, gender, comments, complex, dateOfBirth }: IPatients): Promise<IPatients>{
        return await this.PatientsRepository.registrationPatient({
            name, 
            gender,
            comments,
            complex, 
            dateOfBirth
        });
    }

    
}

export default new CreatePatientsService();