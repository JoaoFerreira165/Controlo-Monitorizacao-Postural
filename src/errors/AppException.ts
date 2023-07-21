
export interface IExcepiton{
  message: string;
  statusCode: number | string; // Coap
  responseCode: number | null; // Coap
}

class Excepiton {
    public readonly message: string;
  
    public readonly statusCode: number | string; // Coap

    public readonly responseCode: number | null; // Coap
  
    constructor(message: string, statusCode: number | string = 400, responseCode: number | null = null ) {
      this.message = message;
      this.statusCode = statusCode;
      this.responseCode = responseCode;
    }
  }
  
  export default Excepiton;
  