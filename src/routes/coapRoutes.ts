import { IncomingMessage, OutgoingMessage } from 'coap';

import SessionController from '../controllers/coap/SessionDataController';
import DeviceController from '../controllers/coap/DeviceController';

const sessionController = new SessionController();
const deviceController = new DeviceController();

const routes = {
    "/savedata": function(req: IncomingMessage, res: OutgoingMessage){
        sessionController.saveDataCoAP(req, res);
    },

    "/connection_device": function(req: IncomingMessage, res: OutgoingMessage){
        deviceController.execAuthentication(req, res);
    },
}

export default routes;
