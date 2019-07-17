import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from 'dist/tasks/dto/create-task.dto';
import { TaskStatus } from './task-status';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(
    { search, status }: GetTasksFilterDto,
    { id: userId }: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    query.andWhere('task.userId = :userId', { userId });
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

  async createTask(dto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.create({ ...dto, status: TaskStatus.OPEN, user });
    await task.save();
    delete task.user;
    return task;
  }
}
