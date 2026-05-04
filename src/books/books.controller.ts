import { Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(): string {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return this.booksService.findOne(+id);
  }

  @Post()
  create(): string {
    return this.booksService.create();
  }

  @Patch(':id')
  update(@Param('id') id: string): string {
    return this.booksService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.booksService.remove(+id);
  }
}
