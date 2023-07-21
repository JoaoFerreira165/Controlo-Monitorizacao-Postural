import { IComplex } from '../../database/drivers/mongoose/model/Complex';

import ComplexRepository from "../../database/drivers/mongoose/repositories/ComplexRepository";

import AppExcepiton from '../../errors/AppException';

class ReadComplexService{
    private ComplexRepository;

    constructor(){
        this.ComplexRepository = new ComplexRepository();
    }

    public async byId(id: string): Promise<IComplex>{
        let complex: IComplex | null;

        try{
            complex = await this.ComplexRepository.filterComplexById(
                id
            );
        }catch (error){
            throw new AppExcepiton('Error filter complex by id');
        }

        if(!complex)
            throw new AppExcepiton('Complex ID does not exist');

        return complex;
    }

    public async readAll(): Promise<IComplex[] | null>{
        let complex: IComplex[] | null;

        try{
            complex = await this.ComplexRepository.filterAllComplexes();
        }catch (error){
            throw new AppExcepiton('Error filter all complexes');
        }

        return complex;
    }

    
}

export default new ReadComplexService();