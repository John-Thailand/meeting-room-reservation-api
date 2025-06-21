import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string, contractStartDate: Date) {
    // TODO: UTC時間でcontract_start_dateを登録する
    const user = this.repo.create({
      email,
      password,
      contract_start_date: contractStartDate
    });

    return this.repo.save(user);
  }

  findOne(id: string) {
    // idがnullだとfindOneByは最初の要素を返してしまう
    if (!id) {
      return null
    }
    return this.repo.findOneBy({ id })
  }

  find(email: string) {
    return this.repo.find({ where:  { email } })
  }

  async update(id: string, attrs: Partial<User>) {
    // 更新対象のユーザーが存在しない場合はエラーを返す
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }

    // 更新後のメールアドレスを既に使っているユーザーが存在する場合はエラーを返す
    if (attrs.email && attrs.email !== user.email) {
      const users = await this.find(attrs.email)
      if (users.length > 0) {
        throw new BadRequestException('email in use')
      }
    }

    // 解約日は契約開始日の後でないとエラーを返す
    const contractStartDate = attrs.contract_start_date
    const withdrawalDate = attrs.withdrawal_date
    if (contractStartDate && withdrawalDate) {
      if (contractStartDate >= withdrawalDate) {
        throw new BadRequestException('the withdrawal date must be later than the contract start date')
      }
    } else if (contractStartDate) {
      if (user.withdrawal_date != null && contractStartDate >= user.withdrawal_date) {
        throw new BadRequestException('the withdrawal date must be later than the contract start date')
      }
    } else if (withdrawalDate) {
      if (user.contract_start_date >= withdrawalDate) {
        throw new BadRequestException('the withdrawal date must be later than the contract start date')
      }
    }

    Object.assign(user, attrs)
    return this.repo.save(user)
  }

  async remove(id: string) {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return this.repo.remove(user)
  }
}
