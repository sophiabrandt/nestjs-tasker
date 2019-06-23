import { IsString, MinLength, MaxLength, Matches } from 'class-validator'

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password too weak: must contain at least 1 uppercase letter, at least 1 lowercase letter and at least 1 number or special character'
  })
  password: string
}
