import { Injectable } from '@nestjs/common';
import { Task } from './tasks.model';

@Injectable()
export class TasksService {
  async getAllTasks(): Promise<Task[]> {
    return [];
  }
}
