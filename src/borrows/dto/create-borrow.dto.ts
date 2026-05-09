import { IsUUID } from 'class-validator';

export class CreateBorrowDto {
  @IsUUID()
  memberId: string;

  @IsUUID()
  bookId: string;
}
