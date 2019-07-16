import { Controller, Get, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.model';
import { CreateTaskDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Post()
  async createTask(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(dto);
  }
}
