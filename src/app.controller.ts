import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './auth/decorators';

@ApiTags('Health')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'API Health Check' })
  getHello() {
    return {
      message: 'Welcome to the Library Management API!',
      status: 'OK',
    };
  }
}
