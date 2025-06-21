import { Expose } from "class-transformer";

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  contract_start_date: Date;

  @Expose()
  withdrawal_date: Date;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
