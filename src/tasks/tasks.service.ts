import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

const noSuchId = (id: number) => new NotFoundException(`No task with id ${id}`);

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async getTasks(dto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(dto, user);
  }

  async getTaskById(id: Task['id'], user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ id, userId: user.id });
    if (!task) {
      throw noSuchId(id);
    }
    return task;
  }

  async createTask(dto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(dto, user);
  }

  async deleteTask(id: Task['id'], user: User): Promise<void> {
    const { affected } = await this.taskRepository.delete({
      id,
      userId: user.id,
    });
    if (!affected) {
      throw noSuchId(id);
    }
  }

  async updateTaskStatus(
    id: Task['id'],
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
