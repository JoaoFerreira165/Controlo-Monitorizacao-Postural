import { IComplex } from '../../database/drivers/mongoose/model/Complex';

import ComplexRepository from "../../database/drivers/mongoose/repositories/ComplexRepository";

class CreateComplexService{
    private ComplexRepository;

    constructor(){
        this.ComplexRepository = new ComplexRepository();
    }

    public async exec({ name, description, contactNumbers, email, address, district, county, town, postcode, coordinates }: IComplex): Promise<IComplex>{
        return await this.ComplexRepository.complexRegister({
            name,
            description,
            contactNumbers, 
            email, 
            address,
            district,
            county,
            town,
            postcode,
            coordinates
        });
    }
}

export default new CreateComplexService();