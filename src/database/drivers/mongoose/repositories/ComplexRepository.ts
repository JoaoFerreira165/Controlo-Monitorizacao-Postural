import Complex, { IComplex } from '../model/Complex';
import { Schema } from 'mongoose';
import { IUpdateComplex } from '../../../../interfaces'
 
class ComplexRepository {

    private complexRepository;

    constructor() {
      this.complexRepository = Complex;
    }

    // Session Repository
    public async complexRegister({ name, description, contactNumbers, email, address, district, county, town, postcode, coordinates }: IComplex): Promise<IComplex> {
      return await this.complexRepository.create({
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
    
    public async filterComplexById(id: string): Promise<IComplex | null> {
      return await this.complexRepository.findById(
          id
      );
    }

    public async filterAllComplexes(): Promise<IComplex[] | null>{
      return await this.complexRepository.find();
    };


    public async updateComplexById({ id, name, description, contactNumbers, email, address, district, county, town, postcode, coordinates }: IUpdateComplex): Promise<IComplex | null> {
      return await this.complexRepository.findByIdAndUpdate({
          _id: id, 
        },
        {
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
        },
        {
            new: true, // Retorna o o objeto atualizado
        }
      );
    }

    public async deleteComplexById(id: string): Promise<IComplex | null> {
      return await this.complexRepository.findByIdAndDelete(
        id
      );
    }
}

export default ComplexRepository;