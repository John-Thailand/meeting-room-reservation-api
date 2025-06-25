import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BusinessHoliday } from './business-holiday.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoworkingSpacesService } from 'src/coworking-spaces/coworking-spaces.service';
import { SearchBusinessHolidaysRequestDto } from './dtos/search-business-holidays-request.dto';
import { SearchBusinessHollidaysResponseDto } from './dtos/search-business-holidays-response.dto';

@Injectable()
export class BusinessHolidaysService {
  constructor(
    private coworkingSpacesService: CoworkingSpacesService,
    @InjectRepository(BusinessHoliday) private repo: Repository<BusinessHoliday>,
  ) {}

  async search(
    coworkingSpaceId: string,
    dto: SearchBusinessHolidaysRequestDto
  ): Promise<SearchBusinessHollidaysResponseDto> {
    // コワーキングスペースが存在しない場合、エラーを返す
    const coworkingSpace = await this.coworkingSpacesService.findOne(coworkingSpaceId)
    if (!coworkingSpace) {
      throw new NotFoundException('coworking space not found')
    }

    let query = this.repo.createQueryBuilder()

    if (dto.start_date && dto.end_date) {
      query = query.andWhere('business_holiday BETWEEN :start_date AND :end_date', {
        start_date: dto.start_date,
        end_date: dto.end_date
      })
    } else if (dto.start_date) {
      query = query.andWhere('business_holiday >= :start_date', {
        start_date: dto.start_date
      })
    } else if (dto.end_date) {
      query = query.andWhere('business_holiday <= :end_date', {
        end_date: dto.end_date
      })
    }

    const order = dto.order.toUpperCase() as 'ASC' | 'DESC'
    query = query.orderBy(dto.order_by, order)

    const allCount = await query.getCount()

    query = query
      .limit(dto.page_size)
      .offset(dto.page)

    const businessHolidays = await query.getMany()

    return {
      business_holidays: businessHolidays,
      total: allCount,
    }
  }

  async create(coworkingSpaceId: string, businessHoliday: Date): Promise<BusinessHoliday> {
    // 指定IDのコワーキングスペースが存在しない場合、エラーを返す
    const coworkingSpace = await this.coworkingSpacesService.findOne(coworkingSpaceId)
    if (!coworkingSpace) {
      throw new NotFoundException('coworking space not found')
    }

    // そのコワーキングスペースで同じ日付を休業日にしようとしている場合、エラーを返す
    const existingBusinessHoliday = await this.repo.findOneBy({
      coworking_space_id: coworkingSpaceId,
      business_holiday: businessHoliday,
      is_deleted: false
    })
    if (existingBusinessHoliday) {
      throw new BadRequestException('already exist business holiday')
    }

    const businessHolidayEntity = this.repo.create({
      coworking_space_id: coworkingSpaceId,
      business_holiday: businessHoliday
    })

    return this.repo.save(businessHolidayEntity)
  }

  async update(id: string, attrs: Partial<BusinessHoliday>): Promise<BusinessHoliday> {
    // 指定IDの休業日が存在しない場合、エラーを返す
    const existingBusinessHoliday = await this.repo.findOneBy({ id, is_deleted: false })
    if (!existingBusinessHoliday) {
      throw new NotFoundException('business holiday not found')
    }

    // 指定IDのコワーキングスペースが存在しない場合、エラーを返す
    if (attrs.coworking_space_id) {
      const coworkingSpace = await this.coworkingSpacesService.findOne(attrs.coworking_space_id)
      if (!coworkingSpace) {
        throw new NotFoundException('coworking space not found')
      }
    }

    // 既にそのコワーキングスペースで同じ休業日が存在している場合、エラーを返す
    const coworkingSpaceId = attrs.coworking_space_id ?? existingBusinessHoliday.coworking_space_id
    if (attrs.business_holiday) {
      const businessHoliday = await this.repo.findOneBy({
        coworking_space_id: coworkingSpaceId,
        business_holiday: attrs.business_holiday
      })
      if (businessHoliday) {
        throw new BadRequestException('already exist business holiday')
      }
    }

    Object.assign(existingBusinessHoliday, attrs)
    return this.repo.save(existingBusinessHoliday)
  }

  async delete(id: string): Promise<void> {
    // 指定IDの休業日が存在しない場合、エラーを返す
    const businessHoliday = await this.repo.findOneBy({ id, is_deleted: false })
    if (!businessHoliday) {
      throw new NotFoundException('business holiday not found')
    }

    businessHoliday.is_deleted = true
    await this.repo.save(businessHoliday)
  }
}
