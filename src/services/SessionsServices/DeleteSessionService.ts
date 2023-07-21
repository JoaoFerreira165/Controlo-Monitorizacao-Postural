import { ISession } from '../../database/drivers/mongoose/model/Sessions';

import SessionsRepository from "../../database/drivers/mongoose/repositories/SessionsRepository";
import ReadSessionService from "../../services/SessionsServices/ReadSessionService";

import AppExcepiton from '../../errors/AppException';


class DeleteSessionService{
    private SessionsRepository;

    constructor(){
        this.SessionsRepository = new SessionsRepository();
    }

    // Se for enviado um objecto vazio, todos as sessões serão eliminadas.
    public async byField(field: { [key: string]: any }): Promise<any>{
        let info;

        if(Object.keys(field)[0] == "id"){
            field['_id'] = field['id'];
            delete field['id'];
        }
        try{
            info = await this.SessionsRepository.deleteSessionByField(
                Object.keys(field)[0], Object.values(field)[0]
            );
        }catch (error){
            throw new AppExcepiton('Error delete session');
        }

        if(!info.deletedCount)
            return { message: "No sessions were deleted", info };
        else
            return { message: "The sessions were successfully deleted", info };
    }

    // public async unfinishedSessions(): Promise<ISession[] | null>{
    //     let sessions: any;

    //     sessions = this.SessionsRepository.deleteUnfinishedSessions()

    //     if(!sessions.length)
    //         throw new AppExcepiton('All session has already ended');
    
    //     try{
    //         sessions.forEach(async element => {
    //             await this.SessionsRepository.deleteSessionByField("_id", element.id!)
    //         });
    //     }catch (error){
    //         throw new AppExcepiton(`Error delete sessions unfinished`);
    //     }

    //     return sessions;
    // }
       
}

export default new DeleteSessionService();