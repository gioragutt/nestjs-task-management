export enum TaskStatus {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  Done = 'DONE',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
