import { Body, Controller, Get, Inject, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard, Public } from '@auth';
import { RequestContext, RequestContextDto } from '@common';
import { AuthCredentialsDto, CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('user - 用户信息类')
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async userLogin(@Body() credential: AuthCredentialsDto) {
    const { account, password } = credential;
    return await this.userService.validateUser(account, password);
  }

  @Public()
  @Post('create')
  @ApiOperation({ summary: '创建用户' })
  async createUser(@Body() createUser: CreateUserDto) {
    return await this.userService.create(createUser);
  }

  @Patch('update')
  @ApiOperation({ summary: '更新用户信息' })
  async updateUser(@Body() updateUser: UpdateUserDto) {
    console.log('updateUser:', updateUser);
  }

  @Get('nav')
  @ApiOperation({ summary: '获取用户导航' })
  async userNav(@RequestContext() context: RequestContextDto) {
    const { user } = context;
    return await this.userService.getModuleNav(user.userId);
  }

  @Get('permission')
  @ApiOperation({ summary: '获取用户权限' })
  async userPermission(@RequestContext() context: RequestContextDto) {
    const { user } = context;
    const permissionPromise = this.userService.getUserPermission(user.userId, user.roles);
    const navPromise = this.userService.getUserNav(user.userId, user.roles);
    const result = await Promise.all([permissionPromise, navPromise]);
    return {
      permission: result[0],
      navs: result[1]
    };
  }
}
