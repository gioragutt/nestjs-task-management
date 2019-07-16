import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  async getAllTasks(): Promise<any[]> {
    return [];
  }
}
