import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchUsersRequestDto } from './dtos/search-users-request.dto';
import { SearchUsersResponseDto } from './dtos/search-users-response.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string, contractStartDate: Date): Promise<User> {
    // TODO: UTC時間でcontract_start_dateを登録する
    const user = this.repo.create({
      email,
      password,
      contract_start_date: contractStartDate
    });

    return this.repo.save(user);
  }

  findOne(id: string): Promise<User> {
    // idがnullだとfindOneByは最初の要素を返してしまう
    if (!id) {
      return null
    }
    return this.repo.findOneBy({ id, is_deleted: false })
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({ where:  { email, is_deleted: false } })
  }

  async update(id: string, attrs: Partial<User>): Promise<User> {
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

  async withdraw(id: string, withdrawal_date: Date): Promise<User> {
    // 対象のユーザーが存在しない場合はエラーを返す
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }

    // 解約日は契約開始日の後でないとエラーを返す
    if (user.contract_start_date >= withdrawal_date) {
      throw new BadRequestException('the withdrawal date must be later than the contract start date')
    }

    user.withdrawal_date = withdrawal_date
    return this.repo.save(user)
  }

  async updateEmail(id: string, email: string): Promise<User> {
    // 更新対象のユーザーが存在しない場合はエラーを返す
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }

    // 更新後のメールアドレスを既に使っているユーザーが存在する場合はエラーを返す
    if (email && email !== user.email) {
      const users = await this.find(email)
      if (users.length > 0) {
        throw new BadRequestException('email in use')
      }
    }

    // 現在と同じメールアドレスに変更しようとした場合もエラーを返す
    if (email === user.email) {
      throw new BadRequestException('your current email address and new email address are the same')
    }

    user.email = email
    return this.repo.save(user)
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<User> {
    // 更新対象のユーザーが存在しない場合はエラーを返す
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }

    // 新しいパスワードと新しい確認用パスワードが一致していない場合はエラーを返す
    if (dto.password !== dto.password_confirmation) {
      throw new BadRequestException('new password and new confirmation password do not match')
    }

    const [storedSalt, storedHash] = user.password.split('.')

    const currentPasswordHash = (await scrypt(dto.current_password, storedSalt, 32)) as Buffer

    // 入力された現在のパスワードが間違っている場合にエラーを返す
    if (storedHash !== currentPasswordHash.toString('hex')) {
      throw new BadRequestException('bad password')
    }

    // 現在のパスワードと新しいパスワードが同じ場合もエラーを返す
    if (dto.current_password === dto.password) {
      throw new BadRequestException('current password and new password are the same')
    }

    // パスワードを暗号化
    const newPasswordSalt = randomBytes(8).toString('hex')
    const newPasswordHash = (await scrypt(dto.password, newPasswordSalt, 32)) as Buffer
    const result = newPasswordSalt + '.' + newPasswordHash.toString('hex')

    // パスワードを変更
    user.password = result

    // TODO: 重大な操作（パスワード変更）は、監視や通知の観点でログを入れても良いかも
    // TODO: またメールアドレス宛にパスワードが変更した旨を通知するのも良い

    return this.repo.save(user)
  }

  async search(dto: SearchUsersRequestDto): Promise<SearchUsersResponseDto> {
    let query =  this.repo
      .createQueryBuilder()
      .where('is_deleted = :is_deleted', {
        is_deleted: false
      })

    if (dto.email) {
      query = query.andWhere('email LIKE :email', {
        email: `%${dto.email}%`
      })
    }

    if (dto.registered_from_date && dto.registered_to_date) {
      query = query.andWhere('contract_start_date BETWEEN :registered_from_date AND :registered_to_date', {
        registered_from_date: dto.registered_from_date,
        registered_to_date: dto.registered_to_date
      })
    } else if (dto.registered_from_date) {
      query = query.andWhere('contract_start_date >= :registered_from_date', {
        registered_from_date: dto.registered_from_date
      })
    } else if (dto.registered_to_date) {
      query = query.andWhere('contract_start_date <= :registered_to_date', {
        registered_to_date: dto.registered_to_date
      })
    }

    if (dto.withdrawal_from_date && dto.withdrawal_to_date) {
      query = query.andWhere('withdrawal_date BETWEEN :withdrawal_from_date AND :withdrawal_to_date', {
        withdrawal_from_date: dto.withdrawal_from_date,
        withdrawal_to_date: dto.withdrawal_to_date
      })
    } else if (dto.withdrawal_from_date) {
      query = query.andWhere('withdrawal_date >= :withdrawal_from_date', {
        withdrawal_from_date: dto.withdrawal_from_date
      })
    } else if (dto.withdrawal_to_date) {
      query = query.andWhere('withdrawal_date <= :withdrawal_to_date', {
        withdrawal_to_date: dto.withdrawal_to_date
      })
    }

    // ===(厳密等価演算子)で型まで一致しているか判定する
    if (dto.include_administrators === false) {
      query = query.andWhere('is_administrator = false')
    }

    const order = dto.order.toUpperCase() as 'ASC' | 'DESC'
    query = query.orderBy(dto.order_by, order)

    const allCount = await query.getCount()

    query = query
      .limit(dto.page_size)
      .offset(dto.page * dto.page_size)

    const users = await query.getMany()

    return {
      users,
      total: allCount,
    }
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('user not found')
    }
    
    user.is_deleted = true
    this.repo.save(user)
  }
}
