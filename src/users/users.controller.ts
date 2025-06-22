import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
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

@Controller('auth')
// @Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Post('/signup')
  @UseGuards(AdminGuard)
  async createUser(@Body() body: CreateUserDto, @Session() session: any): Promise<User> {
    const user = await this.authService.signup(body)
    return user
  }

  @Post('/signin')
  async signin(@Body() body: SigninUserDto, @Session() session: any): Promise<User> {
    const user = await this.authService.signin(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, body)
  }

  @Patch('/:id/withdraw')
  @UseGuards(AdminGuard)
  withdrawUser(@Param('id') id: string, @Body() body: WithdrawUserDto): Promise<User> {
    return this.usersService.withdraw(id, body.withdrawal_date)
  }

  // 検索はデータを見るだけであり副作用がない操作なので、GETにすべき
  @Get('/search')
  @UseGuards(AdminGuard)
  @Serialize(SearchUsersResponseDto)
  // /users/search?email=aaa@gmail.com&order_by=created_at のように RESTでは状態の取得に必要な条件をURLで表現すべきという考え
  // 同じURLを再度アクセスすることで同じ検索結果を得られる
  searchUsers(@Query() query: SearchUsersRequestDto): Promise<SearchUsersResponseDto> {
    return this.usersService.search(query)
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: User): User {
    return user
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id') id: string): Promise<User> {
    console.log('handler is running')
    const user = await this.usersService.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return user
  }

  @Get()
  findAllUsers(@Query('email') email: string): Promise<User[]> {
    return this.usersService.find(email)
  }
}
