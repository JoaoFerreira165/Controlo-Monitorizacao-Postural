import { ITasks } from '../../database/drivers/mongoose/model/Tasks';

import TasksRepository from "../../database/drivers/mongoose/repositories/TasksRepository";

import AppExcepiton from '../../errors/AppException';

class CreateTaskService{
    private TasksRepository;

    constructor(){
        this.TasksRepository = new TasksRepository();
    }

    public async exec({ name, description, comments }: ITasks): Promise<ITasks>{
        let task: ITasks;
        try {
            task = await this.TasksRepository.registrationTask({
                name, 
                description,
                comments
            });
        } catch (error) {
            throw new AppExcepiton('Error create the task');
        }

        return task;
    }

    
}

export default new CreateTaskService();