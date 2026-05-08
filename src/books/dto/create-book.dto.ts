import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  isbn: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsNumber()
  totalQuantity: number;

  @IsNumber()
  @IsOptional()
  availableCopies?: number;
}
