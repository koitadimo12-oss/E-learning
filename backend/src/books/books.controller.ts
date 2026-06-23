import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { Role } from '../common/enums';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

/**
 * API REST des livres de la bibliothèque.
 * Lecture publique, écriture réservée à l'admin.
 */
@ApiTags('Livres')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Lister tous les livres (sans URL PDF — réservée aux connectés)' })
  @Get()
  findAll() {
    return this.booksService.findAllPublic();
  }

  /** Flux PDF — JWT requis (étudiant ou admin) */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lire le PDF d\'un livre (connecté)' })
  @UseGuards(JwtAuthGuard)
  @Get(':id/pdf')
  streamPdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    return this.booksService.streamPdf(id, res);
  }

  @ApiOperation({ summary: 'Obtenir un livre par id (sans URL PDF)' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOnePublic(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un livre (admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un livre (admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un livre (admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
