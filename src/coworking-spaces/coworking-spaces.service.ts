import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoworkingSpace } from './coworking-space.entity';
import { Repository } from 'typeorm';
import { CreateCoworkingSpaceDto } from './dtos/create-coworking-space.dto';

@Injectable()
export class CoworkingSpacesService {
  constructor(@InjectRepository(CoworkingSpace) private repo: Repository<CoworkingSpace>) {}

  create(dto: CreateCoworkingSpaceDto): Promise<CoworkingSpace> {
    const openTime = new Date(`1970-01-01T${dto.open_time}`)
    const closeTime = new Date(`1970-01-01T${dto.close_time}`)

    if (openTime >= closeTime) {
      throw new BadRequestException('close time must be later than open time')
    }

    const coworkingSpace = this.repo.create({
      name: dto.name,
      open_time: dto.open_time,
      close_time: dto.close_time,
    })

    return this.repo.save(coworkingSpace)
  }
}
