import { Injectable } from '@nestjs/common';

@Injectable()
export class MembersService {
  findAll(): string {
    return `This action returns all members`;
  }

  findOne(id: number): string {
    return `This action returns a #${id} member`;
  }

  create(): string {
    return 'This action adds a new member';
  }

  update(id: number): string {
    return `This action updates a #${id} member`;
  }

  remove(id: number): string {
    return `This action removes a #${id} member`;
  }
}
