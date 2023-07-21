import { IncomingMessage, OutgoingMessage } from "coap";
import AppExcepiton from '../../errors/AppException';
import ReadDeviceService from '../../services/DeviceServices/ReadDeviceService';
import chalk from 'chalk';
import { IDeviceWithId } from '../../interfaces'

export const listOfObservers: { [key: string]: OutgoingMessage } = {}; 

class DeviceController{
    
    public async execAuthentication(req: IncomingMessage, res: OutgoingMessage) {
        if (req.headers['Observe'] !== 0){
            const error = new AppExcepiton('The current route needs the observe header equal to 0', '4.02');
            res.statusCode = error.statusCode as string;
            res.end(JSON.stringify({ message: error.message }));
        }else{
            let data: IDeviceWithId = JSON.parse(req.payload.toString().replace(/[']/g, "\"")); // Passar para service?
            
            if(data.authToken){ // Autenticação com token de autenticação 
                try {
                    const msg = await ReadDeviceService.verifyAuthToken(data.authToken);
                    res.write(JSON.stringify({
                        ...msg,
                        url: req.url
                    }));
                    listOfObservers[msg.validateToken.sub] = res;
                    console.log(`[${chalk.cyanBright('DEVICES')}][${chalk.blueBright('INFO')}] Dispositivo ${msg.validateToken.sub} conectado`);
                } catch (error) {
                    if(error instanceof AppExcepiton){
                        res.statusCode = error.statusCode as string;
                        res.end(JSON.stringify({ message: error.message, responseCode: error.responseCode, url: req.url }));
                    }
                }
            }else{ // Autenticação sem token de autenticação
                try {
                    const msg = await ReadDeviceService.auth(data.id, data.password!, req.url);
                    res.write(JSON.stringify({
                        ...msg,
                        url: req.url
                    }));
                    listOfObservers[data.id] = res;
                    console.log(`[${chalk.cyanBright('DEVICES')}][${chalk.blueBright('INFO')}] Dispositivo ${data.id} conectado`);
                } catch (error) {
                    if(error instanceof AppExcepiton){
                        res.statusCode = error.statusCode as string;
                        res.end(JSON.stringify({ message: error.message, responseCode: error.responseCode, url: req.url }));
                    }
                }
            }
        }
    }
    
    public static async verifyConnectionLoop() {
        if(Object.entries(listOfObservers).length){
            for (const [deviceID, res] of Object.entries(listOfObservers)) {
                if(!res.write('{"message":"verifify connection"}')){ // Verificação de ligação ao dipositivo
                    delete listOfObservers[deviceID];
                    console.log(`[${chalk.cyanBright('DEVICES')}][${chalk.blueBright('INFO')}] Dispositivo com o ID ${deviceID} desconectado`);
                }
            }
        }

        Object.entries(listOfObservers).length ? 
            console.log(`[${chalk.cyanBright('DEVICES')}][${chalk.blueBright('INFO')}] Lista dos dispositivos conectados (IDs): ${Object.keys(listOfObservers)}`) :
            console.log(`[${chalk.cyanBright('DEVICES')}][${chalk.blueBright('INFO')}] Não há dispositivos conectados`);

        setTimeout(this.verifyConnectionLoop.bind(this), 30000);
    }
}

export default DeviceController;
