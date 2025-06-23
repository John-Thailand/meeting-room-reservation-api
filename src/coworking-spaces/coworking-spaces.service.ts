import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoworkingSpace } from './coworking-space.entity';
import { Repository } from 'typeorm';
import { CreateCoworkingSpaceDto } from './dtos/create-coworking-space.dto';

@Injectable()
export class CoworkingSpacesService {
  constructor(@InjectRepository(CoworkingSpace) private repo: Repository<CoworkingSpace>) {}

  create(dto: CreateCoworkingSpaceDto): Promise<CoworkingSpace> {
    const openTime = new Date(`1970-01-01T${dto.open_time}:00`)
    const closeTime = new Date(`1970-01-01T${dto.close_time}:00`)

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

  async update(id: string, attrs: Partial<CoworkingSpace>): Promise<CoworkingSpace> {
    // 更新対象のコワーキングスペースが存在しない場合はエラーを返す
    const coworkingSpace = await this.findOne(id)
    if (!coworkingSpace) {
      throw new NotFoundException('coworking space not found')
    }

    // open_timeとclose_timeのチェックを行い問題があればエラーを返す
    const openTimeStr = attrs.open_time ?? coworkingSpace.open_time
    const closeTimeStr = attrs.close_time ?? coworkingSpace.close_time

    if (openTimeStr && closeTimeStr) {
      const openTime = new Date(`1970-01-01T${openTimeStr}:00`)
      const closeTime = new Date(`1970-01-01T${closeTimeStr}:00`)
      if (openTime >= closeTime) {
        throw new BadRequestException('close time must be later than open time')
      }
    }

    Object.assign(coworkingSpace, attrs)
    return this.repo.save(coworkingSpace)
  }

  async delete(id: string): Promise<void> {
    // 削除対象のコワーキングスペースが存在しない場合はエラーを返す
    const coworkingSpace = await this.findOne(id)
    if (!coworkingSpace) {
      throw new NotFoundException('coworking space not found')
    }

    coworkingSpace.is_deleted = true
    await this.repo.save(coworkingSpace)
  }

  find(): Promise<CoworkingSpace[]> {
    return this.repo.find({ where:  { is_deleted: false } })
  }

  findOne(id: string): Promise<CoworkingSpace> {
    // idがnullだとfindOneByは最初の要素を返してしまう
    if (!id) {
      return null
    }
    return this.repo.findOneBy({ id, is_deleted: false })
  }
}
