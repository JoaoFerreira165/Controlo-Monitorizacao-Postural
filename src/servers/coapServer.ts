import * as coapServer from "coap";
import routes from '../routes/coapRoutes';

// Configs
coapServer.parameters.exchangeLifetime = Number(process.env.COAP_ExchangeLifetime);

class CoAPServer{
  
  // Propriedades
  private _server: coapServer.Server;
  
  // Construtor
  constructor(){
    this._server = coapServer.createServer(async (req, res) => { 
      
      let selectedRoute = routes[req.url as keyof typeof routes];
      
      if(!selectedRoute){
        console.log("rota não encontrada");
        return;
      }else{
        selectedRoute(req, res);
      }
      
      res.on('error', err => {
        console.error('Error by receiving: ' + err)
      });
      
      res.on('finish', () => {
        console.log("Desconectou!!!")
      })
      
    });
  }
  
  get server(): coapServer.Server {
    return this._server;
  }
  
  set server(value: coapServer.Server) {
    this._server = value;
  }
  
}

export default CoAPServer;