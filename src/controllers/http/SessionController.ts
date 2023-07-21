import { Request, Response } from 'express';
import CreateSessionService from "../../services/SessionsServices/CreateSessionService";
import ReadSessionService from "../../services/SessionsServices/ReadSessionService";
import UpdateSessionService from "../../services/SessionsServices/UpdateSessionService";
import DeleteSessionService from "../../services/SessionsServices/DeleteSessionService";

const stream = require('stream');

class SessionController{
    // Create Controllers
    public async create(request: Request, response: Response): Promise<Response> {
        const session = await CreateSessionService.exec(
            request.body
        );
        
        return response.status(201).json(session);
    }

    // Read Controllers
    public async filterAllSessions(request: Request, response: Response): Promise<Response> {
        const session = await ReadSessionService.all();

        return response.status(201).json(session);
    }


    public async filterById(request: Request, response: Response): Promise<Response> {
        const session = await ReadSessionService.byId(
            request.params.id,
        );

        return response.status(201).json(session);
    }

    public async filterByUnfinishedSessions(request: Request, response: Response): Promise<Response> {
        const session = await ReadSessionService.unfinishedSessions();

        return response.status(201).json(session);
    }

    public async filterSessionsByIds(request: Request, response: Response) {

        const reponseStream = await ReadSessionService.sesssionDatabyId(
            response,
            request.query.id as string[]
        );

        return response.status(201).json(reponseStream);
        //return reponseStream.pipe(response);
    }

    public async exportSessionsByIds(request: Request, response: Response) {

        const fileStream = await ReadSessionService.exportSessionsByIds(
            response,
            request.query.format as string,
            request.query.id as string[]
        );

        return fileStream.pipe(response); // PIPE -> ASSINCRONO
    }

    public async exportSessionsByTimeRange(request: Request, response: Response): Promise<Response> {
        
        const fileStream = await ReadSessionService.exportSessionsByTimeRange(
            response,
            request.query.format as string,
            request.query.start as string,
            request.query.end as string            
        );

        return fileStream.pipe(response); // PIPE -> ASSINCRONO
    }

    public async exportPdfReportsByIds(request: Request, response: Response): Promise<Response> {
        const fileStream = await ReadSessionService.exportSessionsByIds(
            response,
            'csv',
            request.query.id as string[]
        );

        return fileStream.pipe(response); // PIPE -> ASSINCRONO
    }

    // Update Controllers
    public async update(request: Request, response: Response): Promise<Response> {
        const session = await UpdateSessionService.byId(
            request.body
         );

        return response.status(201).json(session);
    }

    public async updateEndAt(request: Request, response: Response): Promise<Response> {
        const session = await UpdateSessionService.atEnd_byId(
            request.body
         );

        return response.status(201).json(session);
    }

    // Delete Controllers
    public async delete(request: Request, response: Response): Promise<Response> {
        const session = await DeleteSessionService.byField(
            request.body
        );

        return response.status(201).json(session);
    }
}

export default SessionController;