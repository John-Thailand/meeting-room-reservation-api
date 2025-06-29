import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { SigninUserDto } from './dtos/signin-user.dto';
import { WithdrawUserDto } from './dtos/withdraw-user.dto';
import { SearchUsersRequestDto } from './dtos/search-users-request.dto';
import { SearchUsersResponseDto } from './dtos/search-users-response.dto';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Post('auth/signup')
  @UseGuards(AdminGuard)
  @Serialize(UserDto)
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    const user = await this.authService.signup(body)
    return user
  }

  @Post('auth/signin')
  @Serialize(UserDto)
  async signin(@Body() body: SigninUserDto, @Session() session: any): Promise<User> {
    const user = await this.authService.signin(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post('auth/signout')
  signOut(@Session() session: any) {
    session.userId = null
  }

  @Patch('users/:id')
  @UseGuards(AdminGuard)
  @Serialize(UserDto)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, body)
  }

  @Delete('users/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id)
  }

  @Patch('users/:id/withdraw')
  @UseGuards(AdminGuard)
  @Serialize(UserDto)
  withdrawUser(@Param('id') id: string, @Body() body: WithdrawUserDto): Promise<User> {
    return this.usersService.withdraw(id, body.withdrawal_date)
  }

  @Patch('users/me/email')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  updateEmail(@Body() body: UpdateEmailDto, @Session() session: any): Promise<User> {
    const userId = session.userId as string
    return this.usersService.updateEmail(userId, body.email)
  }

  @Patch('users/me/password')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  updatePassword(@Body() body: UpdatePasswordDto, @Session() session: any): Promise<User> {
    const userId = session.userId as string
    return this.usersService.updatePassword(userId, body)
  }

  // 検索はデータを見るだけであり副作用がない操作なので、GETにすべき
  @Get('users/search')
  @UseGuards(AdminGuard)
  @Serialize(SearchUsersResponseDto)
  // /users/search?email=aaa@gmail.com&order_by=created_at のように RESTでは状態の取得に必要な条件をURLで表現すべきという考え
  // 同じURLを再度アクセスすることで同じ検索結果を得られる
  searchUsers(@Query() query: SearchUsersRequestDto): Promise<SearchUsersResponseDto> {
    return this.usersService.search(query)
  }

  @Get('users/me')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  getMe(@CurrentUser() user: User): User {
    return user
  }

  @Get('users/:id')
  @UseGuards(AdminGuard)
  @Serialize(UserDto)
  async findUser(@Param('id') id: string): Promise<User> {
    console.log('handler is running')
    const user = await this.usersService.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return user
  }
}
