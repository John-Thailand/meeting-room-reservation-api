import { Module } from '@nestjs/common';
import { CoworkingSpacesController } from './coworking-spaces.controller';
import { CoworkingSpacesService } from './coworking-spaces.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoworkingSpace } from './coworking-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoworkingSpace])],
  controllers: [CoworkingSpacesController],
  providers: [CoworkingSpacesService]
})
export class CoworkingSpacesModule {}
