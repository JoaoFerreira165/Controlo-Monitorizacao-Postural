import { IncomingMessage, OutgoingMessage } from "coap";
import AppExcepiton from '../../errors/AppException';
import CreateSessionDataService from "../../services/SessionsDataCoapService/CreateSessionDataService";
import { ISessionDataReceived } from '../../interfaces'

import webSocketServer from "../../servers/webSocketServer";

class SessionDataController{

    //CoAP
    public async saveDataCoAP(req: IncomingMessage, res: OutgoingMessage){
      let data: ISessionDataReceived = JSON.parse(req.payload.toString().replace(/[']/g, "\"")); // Passar para service?
      
      try {
        const sessionData = await CreateSessionDataService.exec(data);
        const sessionDataStg = JSON.stringify(sessionData);
        res.end(sessionDataStg);


        for (let key in webSocketServer.connectedComplexes) {
          let value = webSocketServer.connectedComplexes[key];
          if(value.sessionId == sessionData.sessionId){
            webSocketServer.connectedComplexes[key].socket?.emit("dataSession_ToUser", sessionDataStg, 200);
          }
      }
        
      }catch(error){
        if(error instanceof AppExcepiton){
          res.statusCode = error.statusCode as string;
          res.end(JSON.stringify({ message: error.message }));
        }
      }

    }
}

export default SessionDataController;
