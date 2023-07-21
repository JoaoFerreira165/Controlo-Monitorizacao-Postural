import { Request, Response } from 'express';
import CreateTaskService from "../../services/TasksServices/CreateTaskService";
import ReadTaskService from "../../services/TasksServices/ReadTaskService";
import UpdateTaskService from "../../services/TasksServices/UpdateTaskService";
import DeleteTaskService from "../../services/TasksServices/DeleteTaskService";

class TaskController{
    public async create(request: Request, response: Response): Promise<Response> {
        
        const task = await CreateTaskService.exec(
            request.body
        );
        
        return response.status(201).json(task);
    }

    public async filterById(request: Request, response: Response): Promise<Response> {
        const task = await ReadTaskService.byId(
            request.params.id,
        );

        return response.status(201).json({ task });
    }

    public async filterAllTasks(request: Request, response: Response): Promise<Response> {
        const tasks = await ReadTaskService.all();

        return response.status(201).json({ tasks });
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const task = await UpdateTaskService.exec(
            request.body
         );

         return response.status(201).json(task);
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        const task = await DeleteTaskService.exec(
            request.body.id
        );

        return response.status(201).json(task);
    }
}

export default TaskController;