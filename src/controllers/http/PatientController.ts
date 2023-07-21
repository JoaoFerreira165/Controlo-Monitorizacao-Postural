import { Request, Response } from 'express';
import CreatePatientsService from "../../services/PatientsServices/CreatePatientsService";
import ReadPatientsService from "../../services/PatientsServices/ReadPatientsServices";
import UpdatePatientsService from "../../services/PatientsServices/UpdatePatientsService";
import DeletePatientsService from "../../services/PatientsServices/DeletePatientsService";

class PatientController{
    public async create(request: Request, response: Response): Promise<Response> {
        const patient = await CreatePatientsService.exec(
            request.body
         );

         return response.status(201).json(patient);
    }

    // Read Controllers
    public async filterById(request: Request, response: Response): Promise<Response> {
        const patient = await ReadPatientsService.byId(
            request.body
         );

         return response.status(201).json({ patient });
    }

    public async filterAllPatients(request: Request, response: Response): Promise<Response> {
        const patients = await ReadPatientsService.all();

         return response.status(201).json({ patients });
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const patient = await UpdatePatientsService.exec(
            request.body
         );

         return response.status(201).json(patient);
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        const patient = await DeletePatientsService.exec(
            request.body
         );

         return response.status(201).json(patient);
    }
}

export default PatientController;