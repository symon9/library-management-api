import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowsController } from './borrows.controller';
import { BorrowsService } from './borrows.service';
import { Borrow } from './borrow.entity';
import { Book } from '../books/book.entity';
import { Member } from '../members/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrow, Book, Member])],
  controllers: [BorrowsController],
  providers: [BorrowsService],
})
export class BorrowsModule {}
