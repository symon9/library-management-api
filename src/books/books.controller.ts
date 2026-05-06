import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  //logged-in user can view books
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  //ParseUUIDPipe validates that :id is a real UUID format; if not throws error
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.findOne(id);
  }

  //Only admins and librarians are allowed to add books
  @Post()
  @Roles('admin', 'librarian')
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  //Only admins and librarians can edit books
  @Patch(':id')
  @Roles('admin', 'librarian')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  //Only Admins can delete books
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.remove(id);
  }
}
