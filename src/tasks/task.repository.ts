import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from 'dist/tasks/dto/create-task.dto';
import { TaskStatus } from './task-status';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks({ search, status }: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere('(task.title ~* :search OR task.description ~* :search)', {
        search,
      });
    }
    return query.getMany();
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const task = this.create({ ...dto, status: TaskStatus.OPEN });
    await task.save();
    return task;
  }
}
