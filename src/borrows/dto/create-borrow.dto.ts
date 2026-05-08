import { IsNumber } from 'class-validator';

export class CreateBorrowDto {
  @IsNumber()
  memberId: number;

  @IsNumber()
  bookId: number;
}
