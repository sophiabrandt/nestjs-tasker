import { Test } from '@nestjs/testing'
import { InternalServerErrorException, ConflictException } from '@nestjs/common'
import { User } from './user.entity'
import { UserRepository } from './user.repository'
import * as bcrypt from 'bcryptjs'

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

  describe('validatePassword', () => {
    let user

    beforeEach(() => {
      userRepository.findOne = jest.fn()
      user = new User()
      user.username = 'testUsername'
      user.validatePassword = jest.fn()
    })

    it('returns the username if validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user)
      user.validatePassword.mockResolvedValue(true)

      const result = await userRepository.validateUserPassword(
        mockCredentialsDto
      )
      expect(result).toEqual('testUsername')
    })

    it('returns null if user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null)

      const result = await userRepository.validateUserPassword(
        mockCredentialsDto
      )
      expect(user.validatePassword).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('returns null if password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user)
      user.validatePassword.mockResolvedValue(false)

      const result = await userRepository.validateUserPassword(
        mockCredentialsDto
      )
      expect(user.validatePassword).toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('testhash')
      expect(bcrypt.hash).not.toHaveBeenCalled()

      const result = await userRepository.hashPassword(
        'testPassword',
        'testSalt'
      )
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt')
      expect(result).toEqual('testhash')
    })
  })
})
