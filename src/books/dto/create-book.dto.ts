import { IsString, IsNumber, IsPositive, IsNotEmpty, Min } from 'class-validator';

export class CreateBookDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  totalQuantity: number;
}