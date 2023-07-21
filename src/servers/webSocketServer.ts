import { Response, NextFunction }  from 'express';
import { Server, Socket } from 'socket.io';
import { ISocketParamsRequest } from '../interfaces';
import httpServer from 'http';
import * as coap from "coap";
// import userService from '@services/UserService'

import { IComplex } from '../database/drivers/mongoose/model/Complex';
import ReadComplexService from '../services/ComplexServices/ReadComplexService';
import CreateSessionService from '../services/SessionsServices/CreateSessionService';
import UpdateSessionService from '../services/SessionsServices/UpdateSessionService';
import { listOfObservers } from '../controllers/coap/DeviceController';
import { IExcepiton } from '../errors/AppException';

class WebSocketServer{

  // Propriedades
  private io: Server;
  static connectedComplexes: { [key: string]: {
    socket: Socket | null,
    sessionId: string | null
  }} = {}; 
  
  // Construtor
  constructor(server: httpServer.Server ){
    this.io = new Server(server, {
      allowUpgrades: false,
      cors: {
        origin: "*"
      }
    });
  }
  
  // Middlewares
  public reqDefinitionMiddleware = (request: ISocketParamsRequest, res: Response, next: NextFunction) => {
    request.io = this.io;
    // request.connectedUsers = WebSocketServer.connectedUsers;

    next();
  };

  // Funções
  public connectionEvent(){

    // Dispositivo para Utilizador em tempo real
    this.io.on('connection', async (socket) => {
      try {

        // Autenticação do utilizador 
        try {
            const complex: IComplex = await ReadComplexService.byId(socket.handshake.query.complex_id as string);
            WebSocketServer.connectedComplexes[complex._id!] = {
                socket: socket,
                sessionId: ""
            };

            socket.emit('connection', '{ "message": "Successful connection" }', 200);
            console.log('Complex with id: ' + complex._id! + ' -> connected');             
        } catch (error) {
            socket.emit('connection', '{ "message": "Complex ID does not exist" }', 400)
        }


        socket.on('start_session', async (data) => {
            try {
                const dataObj = JSON.parse(data);
                if(WebSocketServer.connectedComplexes[dataObj.complex]){
                  const response = await CreateSessionService.exec(dataObj);
                  
                  WebSocketServer.connectedComplexes[dataObj.complex].sessionId = response.id!;
                  socket.emit('start_session', JSON.stringify(response), 200);
                }else{
                  socket.emit('start_session', `{ "message": "Invalid Complex ID" }`, 400);
                }
            } catch (error: any) {
                console.log(error.message)
                socket.emit('start_session', `{ "message": "${error.message}" }`, 400);
            }
        });


        socket.on('stop_session', async (data) => {
            try {
                const dataObj = JSON.parse(data);
                if(WebSocketServer.connectedComplexes[dataObj.complexId].sessionId == dataObj.sessionId){
                  const reponse = await UpdateSessionService.atEnd_byId(dataObj);
                  socket.emit('stop_session', JSON.stringify(reponse), 200);
                }else{
                  socket.emit('start_session', `{ "message": "Invalid Arguments" }`, 400);
                }
            } catch (error: any) {
                console.log(error.message)
                socket.emit('stop_session', `{ "message": "${error.message}" }`, 400);
            }
        });


        socket.on('disconnect', () => {
            console.log("Desconectou-se " + socket.handshake.query.complex_id);
            delete WebSocketServer.connectedComplexes[socket.handshake.query.complex_id as string];
        });

      } catch (error) {
        console.log(error);
      }
    });
  }
}

export default WebSocketServer;
