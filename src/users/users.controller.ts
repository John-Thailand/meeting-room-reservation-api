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

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user
  }

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    // リクエストとレスポンス間のsessionオブジェクトにcolorプロパティを追加
    // そのセッション全体をJSON化・エンコード・署名・クッキーとしてレスポンスヘッダに送信している
    // Set-Cookie: session=eyJjb2xvciI6ImJsdWUifQ==; Path=/; HttpOnly
    // クッキーの名前はsessionという１つのキーの中にまとめて格納される
    session.color = color
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color
  }

  @Post('/signup')
  @UseGuards(AdminGuard)
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body)
    return user
  }

  @Post('/signin')
  async signin(@Body() body: SigninUserDto, @Session() session: any) {
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
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body)
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running')
    const user = await this.usersService.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return user
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email)
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}
