import { TypeOrmModule } from "@nestjs/typeorm";
import { BooksService } from "./books.service";
import { Book } from "./entities/book.entity";
import { BooksController } from "./books.controller";
import { Module } from "@nestjs/common/decorators/modules/module.decorator";
@Module({
 imports: [
   TypeOrmModule.forFeature([Book])
 ],
 controllers: [BooksController],
 providers: [BooksService],
})
export class BooksModule {}