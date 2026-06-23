import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { Role } from '../common/enums';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

/**
 * API REST des cours.
 * Lecture publique, écriture réservée à l'admin (RBAC).
 */
@ApiTags('Cours')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /** Liste tous les cours — accessible sans connexion */
  @ApiOperation({ summary: 'Lister tous les cours' })
  @Get()
  findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  /** Détail d'un cours — accessible sans connexion */
  @ApiOperation({ summary: 'Obtenir un cours par son id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  /** Créer un cours — admin uniquement */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un cours (admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(dto);
  }

  /** Modifier un cours — admin uniquement */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un cours (admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.update(id, dto);
  }

  /** Supprimer un cours — admin uniquement */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un cours (admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.coursesService.remove(id);
  }
}
