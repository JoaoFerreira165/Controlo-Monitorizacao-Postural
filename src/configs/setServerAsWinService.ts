import { Service } from 'node-windows';

const serverAsWinService = new Service({
    name: "Server APPACDM Service",
    description: "Servidor que contem todos os serviços necessários para assegurar todas as funcionalidades do sistema",
    script: "D:\\OneDrive - Universidade Lusiada\\Documents\\Trabalhos\\APPACMD - 2022\\Código\\Server_APPACDM\\src\\server.ts"
});

serverAsWinService.on('intstall', () => {
    serverAsWinService.start();
});

serverAsWinService.install();