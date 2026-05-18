import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schema/project.schema';
import { CrearProyectoDto } from './dto/crear-proyecto';
import { UpdateProjectDto } from './dto/actualizar-proyecto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async crear(dto: CrearProyectoDto, userId: string) {
    return this.projectModel.create({ ...dto, owner: userId });
  }

  async obtenerTodos(userId: string) {
    return this.projectModel.find({ owner: userId });
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
      { new: true },
    );
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    return proyecto;
  }

  async eliminar(id: string, userId: string) {
    const proyecto = await this.projectModel.findOneAndDelete({ _id: id, owner: userId });
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    return { message: 'Proyecto eliminado correctamente' };
  }
}