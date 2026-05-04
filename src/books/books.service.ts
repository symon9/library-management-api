import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {
  findAll(): string {
    return `This action returns all books`;
  }

  findOne(id: number): string {
    return `This action returns a #${id} book`;
  }

  create(): string {
    return 'This action adds a new book';
  }

  update(id: number): string {
    return `This action updates a #${id} book`;
  }

  remove(id: number): string {
    return `This action removes a #${id} book`;
  }
}
