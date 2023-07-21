import httpServer from 'http';
import { Express } from 'express';

class HttpServer{
  private _server: httpServer.Server;

  constructor(app: Express){
    this._server = httpServer.createServer(app);
  }

  get server(): httpServer.Server {
    return this._server;
  }

  set server(value: httpServer.Server) {
    this._server = value;
  }  
}

export default HttpServer;
