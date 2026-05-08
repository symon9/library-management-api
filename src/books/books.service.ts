import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto, UpdateBookDto } from './dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepo.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepo.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return book;
  }

  async create(dto: CreateBookDto): Promise<Book> {
    const existing = await this.bookRepo.findOne({
      where: { isbn: dto.isbn },
    });

    if (existing) {
      throw new ConflictException(
        `A book with ISBN "${dto.isbn}" already exists`,
      );
    }

    const availableCopies = dto.availableCopies ?? dto.totalQuantity;

    const book = this.bookRepo.create({
      ...dto,
      availableCopies,
    });

    return this.bookRepo.save(book);
  }

  async update(id: number, dto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    if (dto.totalQuantity !== undefined) {
      const difference = dto.totalQuantity - book.totalQuantity;
      dto.availableCopies = book.availableCopies + difference;
    }

    await this.bookRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const book = await this.findOne(id);
    await this.bookRepo.remove(book);
    return { message: `Book "${book.title}" has been deleted` };
  }
}
