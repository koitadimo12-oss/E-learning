import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
@Injectable()
export class BooksService {

 constructor(
   @InjectRepository(Book)
   private bookRepository: Repository<Book>,
 ) {}

 create(dto: CreateBookDto) {
   return this.bookRepository.save(dto);
 }

 findAll() {
   return this.bookRepository.find();
 }

 findOne(id: number) {
   return this.bookRepository.findOne({
      where: { id }
   });
 }

 update(id: number, dto: UpdateBookDto) {
   return this.bookRepository.update(id, dto);
 }

 remove(id: number) {
   return this.bookRepository.delete(id);
 }
}