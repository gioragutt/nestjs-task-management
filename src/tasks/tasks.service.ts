import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './tasks.model';

const noSuchId = (id: string) => new NotFoundException(`No task with id ${id}`);

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  async getAllTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async getTasksWithFilters({
    search,
    status,
  }: GetTasksFilterDto): Promise<Task[]> {
    let tasks = await this.getAllTasks();
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    if (search) {
      search = search.toLowerCase();
      tasks = tasks.filter(
        ({ status: s, title, description }) =>
          s.toLowerCase().includes(search) ||
          title.toLowerCase().includes(search) ||
          description.toLowerCase().includes(search),
      );
    }
    return tasks;
  }

  async getTaskById(id: Task['id']): Promise<Task> {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw noSuchId(id);
    }
    return task;
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const task: Task = {
      id: uuid(),
      ...dto,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index < 0) {
      throw noSuchId(id);
    }
    this.tasks.splice(index, 1);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    return task;
  }
}
