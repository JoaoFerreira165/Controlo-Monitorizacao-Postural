import { IComplex } from '../../database/drivers/mongoose/model/Complex';

import ComplexRepository from "../../database/drivers/mongoose/repositories/ComplexRepository";

import AppExcepiton from '../../errors/AppException';

class UpdateComplexService{
    private ComplexRepository;

    constructor(){
        this.ComplexRepository = new ComplexRepository();
    }

    public async exec({ id }: { id: string }): Promise<IComplex>{
        let complex: IComplex | null;

        try{
            complex = await this.ComplexRepository.deleteComplexById(id);
        }catch (error){
            throw new AppExcepiton('Error error delete patient');
        }

        if(!complex)
            throw new AppExcepiton('Patient does not existe');

        return complex;
    }
}

export default new UpdateComplexService();