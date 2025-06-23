import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CoworkingSpacesService } from './coworking-spaces.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateCoworkingSpaceDto } from './dtos/create-coworking-space.dto';
import { CoworkingSpace } from './coworking-space.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CoworkingSpaceDto } from './dtos/coworking-space.dto';
import { UpdateCoworkingSpaceDto } from './dtos/update-coworking-space.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('coworking-spaces')
@Serialize(CoworkingSpaceDto)
export class CoworkingSpacesController {
  constructor(
    private coworkingSpacesService: CoworkingSpacesService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getCoworkingSpaces(): Promise<CoworkingSpace[]> {
    const coworkingSpaces = await this.coworkingSpacesService.find()
    return coworkingSpaces
  }

  @Post()
  @UseGuards(AdminGuard)
  async createCoworkingSpace(@Body() body: CreateCoworkingSpaceDto): Promise<CoworkingSpace> {
    const coworkingSpace = await this.coworkingSpacesService.create(body)
    return coworkingSpace
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async updateCoworkingSpace(@Param('id') id: string, @Body() body: UpdateCoworkingSpaceDto): Promise<CoworkingSpace> {
    const coworkingSpace = await this.coworkingSpacesService.update(id, body)
    return coworkingSpace
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  // レスポンスボディが不要な場合に204 No Contentを返すようにする
  // REST APIのベストプラクティスでも、DELETE成功時には204を使うのが一般的
  @HttpCode(204)
  deleteCoworkingSpace(@Param('id') id: string) {
    // returnしないとエラーを返すことができないので注意が必要
    return this.coworkingSpacesService.delete(id)
  }
}
