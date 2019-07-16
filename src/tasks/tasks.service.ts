import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto';
import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  async getAllTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async getTaskById(id: Task['id']): Promise<Task> {
    return this.tasks.find(t => t.id === id);
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

  async deleteTask(id: string): Promise<void> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index >= 0) {
      this.tasks.splice(index, 1);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    return task;
  }
}
