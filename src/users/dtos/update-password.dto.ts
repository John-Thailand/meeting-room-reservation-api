import { IsString, Length, Matches } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  @Length(8, 16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/, {
    message: 'your password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
  })
  current_password: string;

  @IsString()
  @Length(8, 16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/, {
    message: 'your password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
  })
  password: string;

  @IsString()
  @Length(8, 16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/, {
    message: 'your password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
  })
  password_confirmation: string;
}
