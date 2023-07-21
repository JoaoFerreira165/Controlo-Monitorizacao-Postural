import { ITasks } from '../../database/drivers/mongoose/model/Tasks';

import TasksRepository from "../../database/drivers/mongoose/repositories/TasksRepository";

import { IUpdateTask } from '../../interfaces'

import AppExcepiton from '../../errors/AppException';

class UpdateTaskService{
    private TasksRepository;

    constructor(){
        this.TasksRepository = new TasksRepository();
    }

    public async exec({ id, name, description, comments }: IUpdateTask): Promise<ITasks | null>{
        let task: ITasks | null;

        try{
            task = await this.TasksRepository.updateTaskById({
                id,
                name, 
                description,
                comments
            });
        }catch (error){
            throw new AppExcepiton('Error update the read field');
        }

        if(!task)
            throw new AppExcepiton('ID does not exist');


        return task;
    }

    
}

export default new UpdateTaskService();