import { Test } from '@nestjs/testing'
import { User } from './user.entity'
import * as bcrypt from 'bcryptjs'

describe('User entitity', () => {
  let user

  beforeEach(() => {
    user = new User()
    user.salt = 'testSalt'
    user.password = 'testPassword'
    bcrypt.hash = jest.fn()
  })

  describe('validatePassword', () => {
    it('returns true if password is valid', async () => {
      bcrypt.hash.mockReturnValue('testPassword')
      expect(bcrypt.hash).not.toHaveBeenCalled()
      const result = await user.validatePassword('123456', 'testSalt')
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt')
      expect(result).toEqual(true)
    })
    it('returns false if password is invalid', async () => {
      bcrypt.hash.mockReturnValue('wrongPassword')
      expect(bcrypt.hash).not.toHaveBeenCalled()
      const result = await user.validatePassword('wrongPassword', 'testSalt')
      expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt')
      expect(result).toEqual(false)
    })
  })
})
