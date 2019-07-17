import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';

const SIMPLE_CREATE_TASK_DTO: CreateTaskDto = {
  title: 'Title',
  description: 'Description',
};
const createDto = (num: number): CreateTaskDto => ({
  title: `title${num}`,
  description: `desc${num}`,
});

describe('Tasks Controller', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
      controllers: [TasksController],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  const expectCreateThrows = async (dto: CreateTaskDto) =>
    expect(controller.createTask(dto)).rejects.toThrow(BadRequestException);

  describe('POST /tasks', () => {
    it('should return a new task in POST /task', async () => {
      const createTaskDto: CreateTaskDto = {
        description: 'Desc',
        title: 'Title',
      };
      const task = await controller.createTask(createTaskDto);

      expect(task).toMatchObject({
        ...createTaskDto,
        status: TaskStatus.OPEN,
      });
    });

    xit('should throw with empty title or description when creating post', async () => {
      await expectCreateThrows({ title: 'T', description: '' });
      await expectCreateThrows({ title: '', description: 'D' });
      await expectCreateThrows({ title: '', description: '' });
    });
  });

  describe('PATCH /tasks/:id/status', () => {
    it('should throw if called with unexisting id', async () => {
      await expect(
        controller.updateTaskStatus('', TaskStatus.IN_PROGRESS),
      ).rejects.toThrow(NotFoundException);
    });

    xit('should throw if called with invalid status', async () => {
      const task = await controller.createTask(SIMPLE_CREATE_TASK_DTO);
      await expect(
        controller.updateTaskStatus(task.id, '' as TaskStatus),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update status of existing id', async () => {
      const task = await controller.createTask(SIMPLE_CREATE_TASK_DTO);
      const updated = await controller.updateTaskStatus(
        task.id,
        TaskStatus.IN_PROGRESS,
      );
      expect(updated).toMatchObject({
        ...task,
        status: TaskStatus.IN_PROGRESS,
      });
    });
  });

  describe('GET /tasks', () => {
    it('should initially return an empty list', async () => {
      expect(await controller.getTasks({})).toEqual([]);
    });

    it('should return task after creating', async () => {
      const task = await controller.createTask(SIMPLE_CREATE_TASK_DTO);
      expect(await controller.getTasks({})).toEqual([task]);
    });

    it('should filter by status if specified', async () => {
      const { id } = await controller.createTask(SIMPLE_CREATE_TASK_DTO);
      await controller.createTask(SIMPLE_CREATE_TASK_DTO);
      const updated = await controller.updateTaskStatus(
        id,
        TaskStatus.IN_PROGRESS,
      );
      const tasks = await controller.getTasks({
        status: TaskStatus.IN_PROGRESS,
      });
      expect(tasks).toEqual([updated]);
    });

    it('should filter by search if specified', async () => {
      const task = await controller.createTask(createDto(1));
      await controller.createTask(createDto(2));
      const tasks = await controller.getTasks({ search: 'e1' });
      expect(tasks).toEqual([task]);
    });

    it('should filter by search and status if both specified', async () => {
      const { id } = await controller.createTask(SIMPLE_CREATE_TASK_DTO);
      await controller.createTask(SIMPLE_CREATE_TASK_DTO);
      const updated = await controller.updateTaskStatus(id, TaskStatus.DONE);
      const [filtered, ...rest] = await controller.getTasks({
        search: SIMPLE_CREATE_TASK_DTO.title,
        status: TaskStatus.DONE,
      });
      expect(rest.length).toBe(0);
      expect(filtered).toBe(updated);
    });
  });
});
