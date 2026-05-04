import { Injectable } from '@nestjs/common';

@Injectable()
export class BorrowsService {
  borrowBook(): string {
    return 'This action borrows a book';
  }

  returnBook(id: number): string {
    return `This action returns a borrowed book #${id}`;
  }
}
