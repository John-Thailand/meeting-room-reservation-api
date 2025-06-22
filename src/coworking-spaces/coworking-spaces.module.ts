import { Module } from '@nestjs/common';
import { CoworkingSpacesController } from './coworking-spaces.controller';
import { CoworkingSpacesService } from './coworking-spaces.service';

@Module({
  controllers: [CoworkingSpacesController],
  providers: [CoworkingSpacesService]
})
export class CoworkingSpacesModule {}
