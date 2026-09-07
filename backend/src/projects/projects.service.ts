import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async crear(dto: CreateProjectDto, userId: string) {
    return this.projectModel.create({ ...dto, owner: userId });
  }

  async obtenerTodos(userId: string) {
    return this.projectModel.find({ owner: userId }).sort({ createdAt: -1 });
  }

  async obtenerUno(id: string, userId: string) {
    const proyecto = await this.projectModel.findOne({ _id: id, owner: userId });
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    return proyecto;
  }

  async actualizar(id: string, dto: UpdateProjectDto, userId: string) {
    const proyecto = await this.projectModel.findOneAndUpdate(
      { _id: id, owner: userId },
      dto,
      { new: true, runValidators: true },
    );
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    return proyecto;
  }

  async eliminar(id: string, userId: string) {
    const proyecto = await this.projectModel.findOneAndDelete({ _id: id, owner: userId });
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    
    // Eliminación en cascada de las tareas asociadas al proyecto
    await this.taskModel.deleteMany({ project: id, owner: userId });

    return { message: 'Proyecto y sus tareas eliminados correctamente' };
  }
}