import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { Repository, EntityRepository } from 'typeorm'
import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    const user = new User()
    user.username = username
    user.password = password

    try {
      await user.save()
    } catch (error) {
      // duplicate username
      if (error.code === '23505')
        throw new ConflictException('Username already exists')
    }
    throw new InternalServerErrorException()
  }
}
