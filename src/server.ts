import 'dotenv/config';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import AppException from './errors/AppException';
import { mongodbConnection } from './database/drivers/mongoose';

import routes from './routes/httpRoutes';
import DeviceController from './controllers/coap/DeviceController';
import DeleteSessionService from './services/SessionsServices/DeleteSessionService';

import HttpServer from './servers/httpServer';
import CoAPServer from './servers/coapServer';
import WebSocketServer from './servers/webSocketServer';

import chalk from 'chalk';
import cors from 'cors';

// HTTP Server
const app = express();
const server = new HttpServer(app).server;

// Coap Server
const coapServer = new CoAPServer().server;

// WebSocket Server
const webSocketServer = new WebSocketServer(server);

// Middlewares
app.use(cors({ origin: "*" }));
app.use(webSocketServer.reqDefinitionMiddleware);
app.use(express.json());
app.use(routes);

app.use((except: Error, request: Request, response: Response, next: NextFunction) => {
  if (except instanceof AppException){
    return response.status(except.statusCode as number).json({
      message: except.message
    });
  }
  
  console.error(except);
  
  return response.status(500).json({
    message: 'Internal server error'
  });
});


const startServers = async() => {
  // Connect DB
  await mongodbConnection();

  // Remove unfinished sessions
  try {
    const deletedSessions = await DeleteSessionService.byField({ endAt: "" });
    if(deletedSessions.info.deletedCount)
      console.log(`[${chalk.yellowBright('WARNING')}] Foram eliminada/s ${deletedSessions.info.deletedCount} sessão/ões que não estavam termindas.`);
  } catch (error) {
    console.log(`[${chalk.redBright('ERROR')}] Não foi possível eliminar as sessões não terminadas. Mais informações: ${error}`);
  }

  // CoAP Server
  coapServer.listen(Number(process.env.COAP_PORT), () => {
    console.log(`[${chalk.blueBright('INFO')}] Servidor CoAP em execução na porta ${process.env.COAP_PORT}`);
    DeviceController.verifyConnectionLoop();
  });

  // HTTP Server
  server.listen(process.env.HTTP_PORT, () => {
    console.log(`[${chalk.blueBright('INFO')}] Servidor HTTP em execução na porta ${process.env.HTTP_PORT}`);
    webSocketServer.connectionEvent();
  });
};

startServers();
