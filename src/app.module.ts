import { Module, NestModule, MiddlewareConsumer, NestMiddleware } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPE_ORM_CONFIG } from './typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MorganMiddleware } from '@nest-middlewares/morgan';

@Module({
  imports: [TasksModule, TypeOrmModule.forRoot(TYPE_ORM_CONFIG), AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    MorganMiddleware.configure('common');
    consumer.apply(MorganMiddleware).forRoutes('/');
  }
}
