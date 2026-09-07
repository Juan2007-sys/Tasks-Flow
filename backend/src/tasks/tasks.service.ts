import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Project, ProjectDocument } from '../projects/schemas/project.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async crear(dto: CreateTaskDto, userId: string) {
    // Validar que el proyecto exista y pertenezca al usuario autenticado
    const proyecto = await this.projectModel.findOne({ _id: dto.project, owner: userId });
    if (!proyecto) {
      throw new NotFoundException('El proyecto especificado no existe o no tienes acceso a él');
    }

    return this.taskModel.create({ ...dto, owner: userId });
  }

  async obtenerPorProyecto(projectId: string, userId: string) {
    // Validar que el proyecto pertenezca al usuario
    const proyecto = await this.projectModel.findOne({ _id: projectId, owner: userId });
    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return this.taskModel.find({ project: projectId, owner: userId }).sort({ createdAt: -1 });
  }

  async obtenerUna(id: string, userId: string) {
    const tarea = await this.taskModel.findOne({ _id: id, owner: userId });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    return tarea;
  }

  async actualizar(id: string, dto: UpdateTaskDto, userId: string) {
    const tarea = await this.taskModel.findOneAndUpdate(
      { _id: id, owner: userId },
      dto,
      { new: true, runValidators: true },
    );
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    return tarea;
  }

  async eliminar(id: string, userId: string) {
    const tarea = await this.taskModel.findOneAndDelete({ _id: id, owner: userId });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    return { message: 'Tarea eliminada correctamente' };
  }
}

