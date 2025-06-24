import { BadRequestException, Injectable } from '@nestjs/common';
import { BusinessHoliday } from './business-holiday.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoworkingSpacesService } from 'src/coworking-spaces/coworking-spaces.service';

@Injectable()
export class BusinessHolidaysService {
  constructor(
    private coworkingSpacesService: CoworkingSpacesService,
    @InjectRepository(BusinessHoliday) private repo: Repository<BusinessHoliday>,
  ) {}

  async create(coworkingSpaceId: string, businessHoliday: Date): Promise<BusinessHoliday> {
    // 指定IDのコワーキングスペースが存在しない場合、エラーを返す
    const coworkingSpace = await this.coworkingSpacesService.findOne(coworkingSpaceId)
    if (!coworkingSpace) {
      throw new BadRequestException('coworking space not found')
    }

    // そのコワーキングスペースで同じ日付を休業日にしようとしている場合、エラーを返す
    const existingBusinessHoliday = await this.repo.findOneBy({
      coworking_space_id: coworkingSpaceId,
      business_holiday: businessHoliday,
      is_deleted: false
    })
    if (existingBusinessHoliday) {
      throw new BadRequestException('already business holiday')
    }

    const businessHolidayEntity = this.repo.create({
      coworking_space_id: coworkingSpaceId,
      business_holiday: businessHoliday
    })

    return this.repo.save(businessHolidayEntity)
  }
}

