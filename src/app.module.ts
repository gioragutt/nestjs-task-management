import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPE_ORM_CONFIG } from './typeorm.config';

@Module({
  imports: [TasksModule, TypeOrmModule.forRoot(TYPE_ORM_CONFIG)],
})
export class AppModule {}
