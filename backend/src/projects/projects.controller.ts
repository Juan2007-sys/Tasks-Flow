import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtGuard } from '../auth/jwt.guard';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  crear(@Body() dto: CreateProjectDto, @Request() req: any) {
    return this.projectsService.crear(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los proyectos del usuario autenticado' })
  obtenerTodos(@Request() req: any) {
    return this.projectsService.obtenerTodos(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un proyecto por ID' })
  obtenerUno(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.obtenerUno(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un proyecto existente' })
  actualizar(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Request() req: any) {
    return this.projectsService.actualizar(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un proyecto y sus tareas asociadas' })
  eliminar(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.eliminar(id, req.user.id);
  }
}