import { Controller, Post, Param } from '@nestjs/common';
import { BorrowsService } from './borrows.service';

@Controller('borrows')
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Post()
  borrowBook(): string {
    return this.borrowsService.borrowBook();
  }

  @Post(':id/return')
  returnBook(@Param('id') id: string): string {
    return this.borrowsService.returnBook(+id);
  }
}
