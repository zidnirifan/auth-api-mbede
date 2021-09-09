const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    });
  });

  describe('compare function', () => {
    it('should throw error when password not match', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Assert
      expect(
        bcryptPasswordHash.compare('plain_password', 'hashed_password')
      ).rejects.toThrow(AuthenticationError);
      expect(spyCompare).toBeCalledWith('plain_password', 'hashed_password');
    });

    it('should not return AuthenticationError if password match', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const password = 'password';
      const hashedPasword = await bcrypt.hash(password, 10);

      // Assert
      expect(
        bcryptPasswordHash.compare(password, hashedPasword)
      ).resolves.not.toThrow(AuthenticationError);
      expect(spyCompare).toBeCalledWith(password, hashedPasword);
    });
  });
});
