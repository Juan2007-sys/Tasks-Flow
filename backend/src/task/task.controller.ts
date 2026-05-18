import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './task.service';
import { CrearTareaDto } from './dto/crear-tarea.dto';
import { ActualizarTareaDto } from './dto/actualizar-tarea.dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  crear(@Body() dto: CrearTareaDto, @Request() req) {
    return this.tasksService.crear(dto, req.user.id);
  }

  @Get('proyecto/:projectId')
  obtenerPorProyecto(@Param('projectId') projectId: string, @Request() req) {
    return this.tasksService.obtenerPorProyecto(projectId, req.user.id);
  }

  @Get(':id')
  obtenerUna(@Param('id') id: string, @Request() req) {
    return this.tasksService.obtenerUna(id, req.user.id);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarTareaDto, @Request() req) {
    return this.tasksService.actualizar(id, dto, req.user.id);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string, @Request() req) {
    return this.tasksService.eliminar(id, req.user.id);
  }
}