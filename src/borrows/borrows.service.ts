import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrow, BorrowStatus } from './borrow.entity';
import { Book } from '../books/book.entity';
import { Member } from '../members/member.entity';
import { CreateBorrowDto } from './dto';

@Injectable()
export class BorrowsService {
  constructor(
    @InjectRepository(Borrow)
    private borrowRepo: Repository<Borrow>,
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  async findAll(): Promise<Borrow[]> {
    return this.borrowRepo.find({ relations: ['book', 'member'] });
  }

  async findActive(): Promise<Borrow[]> {
    return this.borrowRepo.find({
      where: { status: BorrowStatus.ACTIVE },
      relations: ['book', 'member'],
    });
  }

  async create(dto: CreateBorrowDto): Promise<Borrow> {
    const book = await this.bookRepo.findOne({ where: { id: dto.bookId } });
    if (!book) {
      throw new NotFoundException(`Book with ID "${dto.bookId}" not found`);
    }

    const member = await this.memberRepo.findOne({
      where: { id: dto.memberId },
    });
    if (!member) {
      throw new NotFoundException(`Member with ID "${dto.memberId}" not found`);
    }

    if (book.availableCopies <= 0) {
      throw new BadRequestException(
        'No copies of this book are currently available',
      );
    }

    const existingActiveBorrow = await this.borrowRepo.findOne({
      where: {
        memberId: dto.memberId,
        bookId: dto.bookId,
        status: BorrowStatus.ACTIVE,
      },
    });

    if (existingActiveBorrow) {
      throw new ConflictException(
        'Member already has an active borrow for this book',
      );
    }

    book.availableCopies -= 1;
    await this.bookRepo.save(book);

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 14);

    const borrow = this.borrowRepo.create({
      memberId: dto.memberId,
      bookId: dto.bookId,
      borrowDate,
      dueDate,
      status: BorrowStatus.ACTIVE,
    });

    return this.borrowRepo.save(borrow);
  }

  async returnBook(id: number): Promise<Borrow> {
    const borrow = await this.borrowRepo.findOne({
      where: { id },
      relations: ['book'],
    });

    if (!borrow) {
      throw new NotFoundException(`Borrow record with ID "${id}" not found`);
    }

    if (borrow.status === BorrowStatus.RETURNED) {
      throw new BadRequestException('This book has already been returned');
    }

    borrow.status = BorrowStatus.RETURNED;
    borrow.returnDate = new Date();
    await this.borrowRepo.save(borrow);

    if (borrow.book) {
      borrow.book.availableCopies += 1;
      await this.bookRepo.save(borrow.book);
    }

    return borrow;
  }
}
