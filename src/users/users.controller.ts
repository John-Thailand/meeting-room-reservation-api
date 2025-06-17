import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

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
  createUser(@Body() body: CreateUserDto) {
    this.authService.signup(body.email, body.password)
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password)
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running')
    const user = await this.usersService.findOne(parseInt(id))
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
    return this.usersService.remove(parseInt(id))
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body)
  }
}
