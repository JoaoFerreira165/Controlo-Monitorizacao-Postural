import Tasks, { ITasks } from '../model/Tasks';

import { IUpdateTask } from '../../../../interfaces';


class TasksRepository{

    private tasksRepository; 

    constructor(){
        this.tasksRepository = Tasks;
    }

    public async registrationTask({ name, description, comments }: ITasks): Promise<ITasks>{
        return await this.tasksRepository.create({
            name, 
            description,
            comments
        });
    };

    public async filterTaskById(id: String): Promise<ITasks | null>{
        return await this.tasksRepository.findById({
            _id: id
        });
    };

    public async filterAllTasks(): Promise<ITasks[] | null>{
        return await this.tasksRepository.find();
    };

    public async updateTaskById({ id, name, description, comments }: IUpdateTask): Promise<ITasks | null>{
        return await this.tasksRepository.findByIdAndUpdate({
            _id: id,
        },
        {
            name,
            description,
            comments
        },
        {
            new: true, // Retorna o o objeto atualizado
            runValidators: true
        }
        );
    };

    public async deleteTaskById(id: String): Promise<ITasks | null>{
        return await this.tasksRepository.findByIdAndDelete({
            _id: id
        });
    };
}

export default TasksRepository;