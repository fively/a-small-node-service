import { Body, Controller, Delete, Get, Inject, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { AclGuard, AuthGuard, Permission } from '@auth';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppModuleService } from './app-module.service';
import { CreateAppModuleDto, UpdateAppModuleDto } from './dto';
import { RequestContext, RequestContextDto } from '@common';

@ApiTags('app-module - 平台模块类')
@Controller('app-module')
@UseGuards(AuthGuard, AclGuard)
export class AppModuleController {
  @Inject(AppModuleService) private readonly appModuleService: AppModuleService;

  @Get('query')
  @ApiOperation({ summary: '获取平台模块' })
  @Permission('system', 'query')
  async queryModule() {
    return await this.appModuleService.query();
  }

  @Post('create')
  @ApiOperation({ summary: '创建平台模块' })
  @Permission('system', 'create')
  async createModule(@RequestContext() context: RequestContextDto, @Body() body: CreateAppModuleDto) {
    return await this.appModuleService.create(body, context);
  }

  @Patch('update')
  @ApiOperation({ summary: '更新平台模块' })
  @Permission('system', 'update')
  async updateModule(@RequestContext() context: RequestContextDto, @Body() body: UpdateAppModuleDto) {
    return await this.appModuleService.update(body, context);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: '删除平台模块' })
  @Permission('system', 'delete')
  async deleteModule(@RequestContext() context: RequestContextDto, @Param() param: { id: string }) {
    return await this.appModuleService.delete(param.id, context);
  }
}
