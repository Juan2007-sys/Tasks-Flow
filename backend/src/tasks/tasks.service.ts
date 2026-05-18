import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CrearTareaDto } from './dto/crear-tarea.dto';
import { ActualizarTareaDto } from './dto/actualizar-tarea.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async crear(dto: CrearTareaDto, userId: string) {
    return this.taskModel.create({ ...dto, owner: userId });
  }

  async obtenerPorProyecto(projectId: string, userId: string) {
    return this.taskModel.find({ project: projectId, owner: userId });
  }

  async obtenerUna(id: string, userId: string) {
    const tarea = await this.taskModel.findOne({ _id: id, owner: userId });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    return tarea;
  }

  async actualizar(id: string, dto: ActualizarTareaDto, userId: string) {
    const tarea = await this.taskModel.findOneAndUpdate(
      { _id: id, owner: userId },
      dto,
      { new: true },
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
