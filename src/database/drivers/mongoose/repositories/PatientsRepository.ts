import Patients, { IPatients } from '../model/Patients';

import { IUpdatePatient, IDeletePatient } from '../../../../interfaces/';

class PatientsRepository{

    private patientsRepository; 

    constructor(){
        this.patientsRepository = Patients;
    }

    public async registrationPatient({ name, gender, comments, complex, dateOfBirth }: IPatients): Promise<IPatients>{
        return await this.patientsRepository.create({
            name, 
            gender,
            comments,
            complex, 
            dateOfBirth
        }
        );
    };

    public async filterPatientById({ id }: IDeletePatient): Promise<IPatients | null>{
        return await this.patientsRepository.findById({
            _id: id
        }).populate('complex');
    };


    public async filterAllPatient(): Promise<IPatients[] | null>{
        return await this.patientsRepository.find().populate('complex');
    };

    public async updatePatientById({ id, name, gender, comments, complex, dateOfBirth }: IUpdatePatient): Promise<IPatients | null>{
        return await this.patientsRepository.findByIdAndUpdate({
            _id: id,
        },
        {
            name,
            gender,
            comments,
            complex,
            dateOfBirth
        },
        {
            new: true, // Retorna o objeto atualizado
            runValidators: true
        }
        );
    };

    public async deletePatientById({ id }: IDeletePatient): Promise<IPatients | null>{
        return await this.patientsRepository.findByIdAndDelete({
            _id: id
        });
    };
}

export default PatientsRepository;