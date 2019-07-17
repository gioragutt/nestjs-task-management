import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';

const noSuchId = (id: number) => new NotFoundException(`No task with id ${id}`);

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async getTasks(dto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(dto);
  }

  async getTaskById(id: Task['id']): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) {
      throw noSuchId(id);
    }
    return task;
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(dto);
  }

  async deleteTask(id: Task['id']): Promise<void> {
    const { affected } = await this.taskRepository.delete(id);
    if (!affected) {
      throw noSuchId(id);
    }
  }

  async updateTaskStatus(id: Task['id'], status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
