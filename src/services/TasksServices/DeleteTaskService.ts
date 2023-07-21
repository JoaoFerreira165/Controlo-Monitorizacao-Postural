import { ITasks } from '../../database/drivers/mongoose/model/Tasks';

import TasksRepository from "../../database/drivers/mongoose/repositories/TasksRepository";

import AppExcepiton from '../../errors/AppException';

class UpdateTaskService{
    private TasksRepository;

    constructor(){
        this.TasksRepository = new TasksRepository();
    }

    public async exec(id: string): Promise<ITasks | null>{
        let task: ITasks | null;

        try{
            task = await this.TasksRepository.deleteTaskById(
                id
            );
        }catch (error){
            throw new AppExcepiton('Error delete task');
        }

        if(!task)
            throw new AppExcepiton('Task does not task');


        return task;
    }

    
}

export default new UpdateTaskService();