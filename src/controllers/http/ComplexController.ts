import { Request, Response } from 'express';
import CreateComplexService from "../../services/ComplexServices/CreateComplexService";
import UpdateComplexService from "../../services/ComplexServices/UpdateComplexService";
import DeleteComplexService from "../../services/ComplexServices/DeleteComplexService";
import ReadComplexService from "../../services/ComplexServices/ReadComplexService";

class ComplexController{
    public async create(request: Request, response: Response): Promise<Response> {
        const complex = await CreateComplexService.exec(
            request.body
        );
        
        return response.status(201).json(complex);
    }

    public async read(request: Request, response: Response): Promise<Response> {
        const complex = await ReadComplexService.byId(
            request.params.id
        );
        
        return response.status(201).json(complex);
    }

    public async filterAllComplexes(request: Request, response: Response): Promise<Response> {
        const complex = await ReadComplexService.readAll();
        
        return response.status(201).json(complex);
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const complex = await UpdateComplexService.exec(
            request.body
        );
        
            return response.status(201).json(complex);
    }
    
    public async delete(request: Request, response: Response): Promise<Response> {
        const complex = await DeleteComplexService.exec(
            request.body
        );
        
        return response.status(201).json(complex);
    }
}

export default ComplexController;