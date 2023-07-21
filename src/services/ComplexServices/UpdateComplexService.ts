import { IComplex } from '../../database/drivers/mongoose/model/Complex';

import ComplexRepository from "../../database/drivers/mongoose/repositories/ComplexRepository";

import { IUpdateComplex } from '../../interfaces';

import AppExcepiton from '../../errors/AppException';

class UpdateComplexService{
    private ComplexRepository;

    constructor(){
        this.ComplexRepository = new ComplexRepository();
    }

    public async exec({ id, name, description, contactNumbers, email, address, district, county, town, postcode, coordinates }: IUpdateComplex): Promise<IComplex>{
        let complex: IComplex | null;

        try{
            complex = await this.ComplexRepository.updateComplexById({ id, name, description, contactNumbers, email, address, district, county, town, postcode, coordinates });
        }catch (error){
            throw new AppExcepiton('Error update complex');
        }

        if(!complex)
            throw new AppExcepiton('Complex does not existe');


        return complex;
    }
}

export default new UpdateComplexService();
