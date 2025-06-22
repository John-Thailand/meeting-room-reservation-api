import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./user.entity";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(dto: CreateUserDto): Promise<User> {
    // see if email is in use
    const users = await this.usersService.find(dto.email)
    if (users.length > 0) {
      throw new BadRequestException('email in use')
    }

    // encrypt the password
    const salt = randomBytes(8).toString('hex')
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer
    const result = salt + '.' + hash.toString('hex')

    // create user record
    const user = await this.usersService.create(dto.email, result, dto.contract_start_date)

    // return the user
    return user
  }

  async signin(email: string, password: string): Promise<User> {
    const [user] = await this.usersService.find(email)
    if (!user) {
      throw new NotFoundException('user not found')
    }

    const [salt, storedHash] = user.password.split('.')

    const hash = (await scrypt(password, salt, 32)) as Buffer

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password')
    }

    return user
  }
}
