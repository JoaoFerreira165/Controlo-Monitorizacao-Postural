import { Router } from 'express';

import ComplexController from '../controllers/http/ComplexController';
import DeviceController from '../controllers/http/DeviceController';
import PatientController from '../controllers/http/PatientController';
import SessionController from '../controllers/http/SessionController';
import SessionDataController from '../controllers/coap/SessionDataController';
import TaskController from '../controllers/http/TaskController';

const routes = Router();
const complexController = new ComplexController();
const deviceController = new DeviceController();
const patientController = new PatientController();
const sessionController = new SessionController();
const taskController = new TaskController();
const sessionDataController = new SessionDataController();

// Patient Routes
routes.get('/patient/read', patientController.filterById);
routes.get('/patient/readAll', patientController.filterAllPatients);
routes.post('/patient/create', patientController.create);
routes.post('/patient/update', patientController.update);
routes.delete('/patient/delete', patientController.delete);

// Session Routes
routes.get('/session/filter/all', sessionController.filterAllSessions);
routes.get('/session/filter/id/:id', sessionController.filterById);
routes.get('/session/filter/unfinished', sessionController.filterByUnfinishedSessions);
routes.get('/session/filter/sessions_data/ids', sessionController.filterSessionsByIds);
routes.get('/session/export/timerange', sessionController.exportSessionsByTimeRange);
routes.get('/session/export/ids', sessionController.exportSessionsByIds);
routes.post('/session/create', sessionController.create);
routes.post('/session/update', sessionController.update);
routes.post('/session/update/endAt', sessionController.updateEndAt);
routes.delete('/session/delete', sessionController.delete);

// Complex Routes
routes.get('/complex/read/:id', complexController.read);
routes.get('/complex/readAll', complexController.filterAllComplexes);
routes.post('/complex/create', complexController.create);
routes.post('/complex/update', complexController.update);
routes.delete('/complex/delete', complexController.delete);

// Tasks Routes
routes.get('/task/read/:id', taskController.filterById);
routes.get('/task/readAll', taskController.filterAllTasks);
routes.post('/task/create', taskController.create);
routes.post('/task/update', taskController.update);
routes.delete('/task/delete', taskController.delete);

// Device Routes
routes.post('/device/create', deviceController.create);
routes.get('/device/filter/:id', deviceController.filterDevice);
routes.get('/device/readAll', deviceController.filterAllDevices);

export default routes;
