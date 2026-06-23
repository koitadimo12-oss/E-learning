import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import type { Response } from 'express';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

/** Retire l'URL PDF des réponses publiques */
function sansPdfUrl(livre: Book) {
  const { pdfUrl: _pdf, ...publicData } = livre;
  return publicData;
}

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(dto: CreateBookDto) {
    const livre = this.bookRepository.create(dto);
    return this.bookRepository.save(livre);
  }

  async findAll() {
    return this.bookRepository.find({ order: { id: 'DESC' } });
  }

  /** Catalogue public — pas d'URL PDF exposée */
  async findAllPublic() {
    const rows = await this.findAll();
    return rows.map(sansPdfUrl);
  }

  async findOne(id: number) {
    const livre = await this.bookRepository.findOne({ where: { id } });
    if (!livre) throw new NotFoundException(`Livre #${id} introuvable.`);
    return livre;
  }

  async findOnePublic(id: number) {
    return sansPdfUrl(await this.findOne(id));
  }

  /** Télécharge le PDF source et le renvoie au lecteur (utilisateur connecté) */
  async streamPdf(id: number, res: Response) {
    const livre = await this.findOne(id);
    if (!livre.pdfUrl || livre.pdfUrl === 'text-mode') {
      throw new BadRequestException('Ce livre n\'a pas de PDF disponible.');
    }

    try {
      const upstream = await axios.get(livre.pdfUrl, {
        responseType: 'stream',
        timeout: 30000,
        maxRedirects: 5,
        headers: { 'User-Agent': 'KaayNiouDiang-BookReader/1.0' },
      });

      const rawType = upstream.headers['content-type'];
      const contentType = typeof rawType === 'string' ? rawType : 'application/pdf';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="livre-${id}.pdf"`);
      upstream.data.pipe(res);
    } catch {
      throw new BadRequestException('Impossible de charger le PDF de ce livre.');
    }
  }

  async update(id: number, dto: UpdateBookDto) {
    const livre = await this.findOne(id);
    Object.assign(livre, dto);
    return this.bookRepository.save(livre);
  }

  async remove(id: number) {
    const livre = await this.findOne(id);
    await this.bookRepository.remove(livre);
  }
}
