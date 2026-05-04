import { Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(): string {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return this.membersService.findOne(+id);
  }

  @Post()
  create(): string {
    return this.membersService.create();
  }

  @Patch(':id')
  update(@Param('id') id: string): string {
    return this.membersService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.membersService.remove(+id);
  }
}
