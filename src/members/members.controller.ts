import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto, UpdateMemberDto } from './dto';
import { Roles } from '../auth/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Members')
@ApiBearerAuth()
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({ status: 200, description: 'List of all members.' })
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific member by ID' })
  @ApiResponse({ status: 200, description: 'Member retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.membersService.findOne(id);
  }

  @Post()
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ status: 201, description: 'Member successfully created.' })
  @ApiResponse({
    status: 409,
    description: 'Member with email already exists.',
  })
  create(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  @Patch(':id')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Update a member' })
  @ApiResponse({ status: 200, description: 'Member successfully updated.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMemberDto) {
    return this.membersService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Deactivate a member' })
  @ApiResponse({ status: 200, description: 'Member successfully deactivated.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.membersService.deactivate(id);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a member (Soft Delete)' })
  @ApiResponse({ status: 200, description: 'Member successfully deactivated.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.membersService.deactivate(id);
  }
}
