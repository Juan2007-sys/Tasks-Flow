import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Task, TaskSchema } from '../tasks/schemas/task.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
    AuthModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}