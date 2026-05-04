import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowsController } from './borrows.controller';
import { BorrowsService } from './borrows.service';
import { Borrow } from './borrow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrow])],
  controllers: [BorrowsController],
  providers: [BorrowsService],
})
export class BorrowsModule {}
