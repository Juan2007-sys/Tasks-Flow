import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtGuard } from '../auth/jwt.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea en un proyecto' })
  crear(@Body() dto: CreateTaskDto, @Request() req: any) {
    return this.tasksService.crear(dto, req.user.id);
  }

  @Get('proyecto/:projectId')
  @ApiOperation({ summary: 'Listar todas las tareas de un proyecto' })
  obtenerPorProyecto(@Param('projectId') projectId: string, @Request() req: any) {
    return this.tasksService.obtenerPorProyecto(projectId, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de una tarea por ID' })
  obtenerUna(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.obtenerUna(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar título, descripción o estado de una tarea' })
  actualizar(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req: any) {
    return this.tasksService.actualizar(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  eliminar(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.eliminar(id, req.user.id);
  }
}

