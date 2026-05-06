import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @Roles('admin', 'librarian')
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'librarian')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.membersService.findOne(id);
  }

  @Post()
  @Roles('admin', 'librarian')
  create(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  @Patch(':id')
  @Roles('admin', 'librarian')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMemberDto) {
    return this.membersService.update(id, dto);
  }

  // Separate route for deactivation — no hard deletes
  @Patch(':id/deactivate')
  @Roles('admin')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.membersService.deactivate(id);
  }
}
