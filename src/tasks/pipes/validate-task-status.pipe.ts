import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status';

function validateStatus(status: TaskStatus) {
  if (!(status in TaskStatus)) {
    throw new BadRequestException(`TaskStatus '${status}' is invalid`);
  }
}

export class ValidateTaskStatusPipe implements PipeTransform {
  transform(value: any) {
    validateStatus(value);
    return value;
  }
}
