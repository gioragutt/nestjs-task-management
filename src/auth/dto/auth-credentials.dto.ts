import { IsString, Matches, Length } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @Length(4, 20)
  @Matches(/^\w+$/, { message: 'username must contain letters and numbers only' })
  username: string;

  @IsString()
  @Length(8, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must have at least one lowercase letter, one uppercase letter, and at least one number or special character',
  })
  password: string;
}
