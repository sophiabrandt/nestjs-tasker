import { Test } from '@nestjs/testing'
import { InternalServerErrorException, ConflictException } from '@nestjs/common'
import { UserRepository } from './user.repository'

const mockCredentialsDto = { username: 'TestUser', password: 'testpass123' }

describe('UserRepository', () => {
  let userRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile()

    userRepository = await module.get<UserRepository>(UserRepository)
  })

  describe('signUp', () => {
    let save

    beforeEach(() => {
      save = jest.fn()
      userRepository.create = jest.fn().mockReturnValue({ save })
    })

    it('successfully signs up the user', () => {
      save.mockResolvedValue(undefined)
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow()
    })

    it('throws a conflict exception if username already exists', () => {
      save.mockRejectedValue({ code: '23505' })
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException
      )
    })

    it('throws an internal server error for other exceptions', () => {
      save.mockRejectedValue({ code: '235055' }) // unhandled error code
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException
      )
    })
  })
})
