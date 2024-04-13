import { Body, Controller, Get, Inject, Patch, Post, Delete, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestContext, RequestContextDto } from '@common';
import { AuthGuard, AclGuard } from '@auth';
import { NavService } from './nav.service';
import { CreateNavDto } from './dto';

@ApiTags('nav - 导航类')
@Controller('nav')
@UseGuards(AuthGuard, AclGuard)
export class NavController {
  @Inject(NavService) private readonly navService: NavService;

  @Get('query')
  @ApiOperation({ summary: '获取平台导航' })
  async queryNav() {
    return await this.navService.query();
  }

  @Post('create')
  @ApiOperation({ summary: '创建平台导航' })
  async createNav(@RequestContext() context: RequestContextDto, @Body() body: CreateNavDto) {
    return await this.navService.create(body, context);
  }

  @Patch('update')
  @ApiOperation({ summary: '修改平台导航' })
  async updateNav(@RequestContext() context: RequestContextDto, @Body() body: CreateNavDto) {
    return await this.navService.create(body, context);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: '修改平台导航' })
  async deleteNav(@RequestContext() context: RequestContextDto, @Body() body: CreateNavDto) {
    return await this.navService.create(body, context);
  }
}
