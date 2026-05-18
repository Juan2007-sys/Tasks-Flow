import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TaskModule } from './task/task.module';

@Module({  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs'),
    AuthModule,
    ProjectsModule,
    TaskModule
  ],
})

export class AppModule {}