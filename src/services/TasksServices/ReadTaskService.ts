import { ITasks } from '../../database/drivers/mongoose/model/Tasks';

import TasksRepository from "../../database/drivers/mongoose/repositories/TasksRepository";

import AppExcepiton from '../../errors/AppException';

class ReadTaskService{
    private TasksRepository;

    constructor(){
        this.TasksRepository = new TasksRepository();
    }

    public async byId(id: string): Promise<ITasks | null>{
        let task: ITasks | null;

        try{
            task = await this.TasksRepository.filterTaskById(
                id
            );
        }catch (error){
            throw new AppExcepiton('Error filter task by id');
        }

        if(!task)
            throw new AppExcepiton('Task ID does not exist');


        return task;
    }

    public async all(): Promise<ITasks[] | null>{
        let patient: ITasks[] | null;

        try{
            patient = await this.TasksRepository.filterAllTasks();
        }catch (error){
            throw new AppExcepiton('Error filter patient by id');
        }

        return patient;
    }

    
}

export default new ReadTaskService();