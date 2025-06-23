import { Module } from '@nestjs/common';
import { CoworkingSpacesController } from './coworking-spaces.controller';
import { CoworkingSpacesService } from './coworking-spaces.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoworkingSpace } from './coworking-space.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoworkingSpace, User])],
  controllers: [CoworkingSpacesController],
  providers: [
    CoworkingSpacesService,
    UsersService,
  ]
})
export class CoworkingSpacesModule {}
