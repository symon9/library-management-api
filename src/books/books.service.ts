import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  // InjectRepository gives a TypeORM repository i.e the database interface for Book
  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  //to GET all books
  // GET all books
  findAll(): Promise<Book[]> {
    return this.bookRepo.find();
  }

  //to GET one book by ID; if book does not exist, throws error
  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepo.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    return book;
  }

  //POST: to create a new book;
  async create(dto: CreateBookDto): Promise<Book> {
    // this checks if a book with this ISBN already exists
    const existing = await this.bookRepo.findOne({
      where: { isbn: dto.isbn },
    });

    if (existing) {
      throw new ConflictException(
        `A book with ISBN "${dto.isbn}" already exists`,
      );
    }

    // availableCopies starts equal to totalQuantity when first added
    const book = this.bookRepo.create({
      ...dto,
      availableCopies: dto.totalQuantity,
    });

    return this.bookRepo.save(book);
  }

  // PATCH: this updates a book (only the fields you send)
  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    // findOne throws 404 if book doesn't exist — no need to check again
    await this.findOne(id);

    // If they're updating totalQuantity, adjust availableCopies by the same difference
    if (dto.totalQuantity !== undefined) {
      const current = await this.findOne(id);
      const difference = dto.totalQuantity - current.totalQuantity;
      await this.bookRepo.update(id, {
        ...dto,
        availableCopies: current.availableCopies + difference,
      });
    } else {
      await this.bookRepo.update(id, dto);
    }

    return this.findOne(id);
  }

  // DELETE: this removes a book entirely
  async remove(id: string): Promise<{ message: string }> {
    const book = await this.findOne(id);
    await this.bookRepo.remove(book);
    return { message: `Book "${book.title}" has been deleted` };
  }
}
