import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from 'dist/tasks/tasks.model';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }
}
