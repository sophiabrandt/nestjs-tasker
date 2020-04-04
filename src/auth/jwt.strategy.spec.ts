import { Test } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { User } from './user.entity'
import { UserRepository } from './user.repository'
import { JwtStrategy } from './jwt.strategy'

const mockUserRepository = () => ({
  findOne: jest.fn(),
})

describe('JwtStrategy', () => {
  let userRepository
  let jwtStrategy: JwtStrategy

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile()

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy)
    userRepository = await module.get<UserRepository>(UserRepository)
  })

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User()
      user.username = 'TestUser'

      userRepository.findOne.mockResolvedValue(user)
      const result = await jwtStrategy.validate({ username: 'TestUser' })
      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'TestUser',
      })
      expect(result).toEqual({ username: 'TestUser' })
    })
    it('throws an unauthorized exception if user cannot be found', () => {
      userRepository.findOne.mockResolvedValue(null)
      expect(jwtStrategy.validate({ username: 'TestUser' })).rejects.toThrow(
        UnauthorizedException
      )
    })
  })
})
