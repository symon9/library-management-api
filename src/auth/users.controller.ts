import { Controller, Patch, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateRoleDto } from './dto';
import { Roles } from './decorators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Patch(':id/role')
  @Roles('admin')
  @ApiOperation({ summary: 'Promote/Change user role (Admin only)' })
  @ApiResponse({ status: 200, description: 'Role successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.authService.updateRole(id, dto.role);
  }
}
