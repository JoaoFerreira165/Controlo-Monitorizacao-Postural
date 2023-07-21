import { ISessionData, IData } from '../../database/drivers/mongoose/model/Sessions_Data';
import { ISession } from '../../database/drivers/mongoose/model/Sessions';
import SessionsRepository from "../../database/drivers/mongoose/repositories/SessionsRepository";
import { ISessionDataReceived } from '../../interfaces'
import AppExcepiton from '../../errors/AppException';

import { verify, JwtPayload } from 'jsonwebtoken';

class CreateSessionService{
    private SessionsRepository;

    constructor(){
        this.SessionsRepository = new SessionsRepository();
    }

    public async exec({sessionToken, data}: ISessionDataReceived): Promise<ISessionData>{
        let sessionData: ISessionData;
        let session: ISession | null;
        let validateToken: JwtPayload;

        try {
             validateToken = verify(sessionToken, process.env.SECRET!) as JwtPayload;
        } catch {
            throw new AppExcepiton('Invalid token', '4.06', 0x129);
        }

        if(!validateToken.sub)
            throw new AppExcepiton('There is no id available in the received token', '4.04', 0x130);

        if(!validateToken.session_id)
            throw new AppExcepiton('There is no session id available in the received token', '4.04', 0x128);
   
/*
        try { 
            session = await this.SessionsRepository.filterSessionById(validateToken.session_id); // Verifica só uma vez. Ou nenhuma? Desnecessário?
        } catch (error) {
            throw new AppExcepiton('Error to filter session id');
        }

        if(!session){
            throw new AppExcepiton('Session ID not found');
        }
*/

        sessionData = await this.SessionsRepository.storeSessionData({
            sessionId: validateToken.session_id,
            data
        });
        //console.log(sessionData);
        return sessionData;
    }    
}

export default new CreateSessionService();