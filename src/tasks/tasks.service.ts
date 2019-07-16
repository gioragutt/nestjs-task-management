import { Injectable } from '@nestjs/common';
import { Task } from './tasks.model';
import { TaskStatus } from './tasks.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  async getAllTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const task: Task = {
      id: uuid(),
      ...dto,
      status: TaskStatus.Open,
    };

    this.tasks.push(task);
    return task;
  }
}
