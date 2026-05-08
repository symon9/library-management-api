import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { CreateBorrowDto } from './dto';
import { Roles } from '../auth/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Borrows')
@ApiBearerAuth()
@Controller('borrows')
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Get()
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Get all borrows' })
  @ApiResponse({ status: 200, description: 'List of all borrows.' })
  findAll() {
    return this.borrowsService.findAll();
  }

  @Get('active')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Get all active borrows' })
  @ApiResponse({ status: 200, description: 'List of active borrows.' })
  findActive() {
    return this.borrowsService.findActive();
  }

  @Post()
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({ status: 201, description: 'Book successfully borrowed.' })
  @ApiResponse({
    status: 400,
    description: 'Book not available or member capacity reached.',
  })
  @ApiResponse({ status: 404, description: 'Book or member not found.' })
  create(@Body() dto: CreateBorrowDto) {
    return this.borrowsService.create(dto);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Return a book' })
  @ApiResponse({ status: 200, description: 'Book successfully returned.' })
  @ApiResponse({ status: 400, description: 'Book is already returned.' })
  @ApiResponse({ status: 404, description: 'Borrow record not found.' })
  returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.borrowsService.returnBook(id);
  }
}
