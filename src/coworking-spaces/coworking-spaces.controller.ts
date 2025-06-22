import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CoworkingSpacesService } from './coworking-spaces.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateCoworkingSpaceDto } from './dtos/create-coworking-space.dto';
import { CoworkingSpace } from './coworking-space.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CoworkingSpaceDto } from './dtos/coworking-space.dto';

@Controller('coworking-spaces')
@Serialize(CoworkingSpaceDto)
export class CoworkingSpacesController {
  constructor(
    private coworkingSpacesService: CoworkingSpacesService
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  async createCoworkingSpace(@Body() body: CreateCoworkingSpaceDto): Promise<CoworkingSpace> {
    const coworkingSpace = await this.coworkingSpacesService.create(body)
    return coworkingSpace
  }
}
