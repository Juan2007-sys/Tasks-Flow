import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CrearProyectoDto } from './dto/crear-proyecto';
import { UpdateProjectDto } from './dto/actualizar-proyecto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  crear(@Body() dto: CrearProyectoDto, @Request() req) {
    return this.projectsService.crear(dto, req.user.id);
  }

  @Get()
  obtenerTodos(@Request() req) {
    return this.projectsService.obtenerTodos(req.user.id);
  }

  @Get(':id')
  obtenerUno(@Param('id') id: string, @Request() req) {
    return this.projectsService.obtenerUno(id, req.user.id);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Request() req) {
    return this.projectsService.actualizar(id, dto, req.user.id);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string, @Request() req) {
    return this.projectsService.eliminar(id, req.user.id);
  }
}