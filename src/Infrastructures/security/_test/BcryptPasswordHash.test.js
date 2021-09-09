const bcrypt = require('bcrypt');
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
    it('should return false when password not match', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const match = await bcryptPasswordHash.compare(
        'plain_password',
        'hashed_password'
      );

      // Assert
      expect(typeof match).toEqual('boolean');
      expect(match).toEqual(false);
      expect(spyCompare).toBeCalledWith('plain_password', 'hashed_password');
    });

    it('should return true when password match', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const password = 'password';
      const hashedPasword = await bcrypt.hash(password, 10);

      // Action
      const match = await bcryptPasswordHash.compare(password, hashedPasword);

      // Assert
      expect(typeof match).toEqual('boolean');
      expect(match).toEqual(true);
      expect(spyCompare).toBeCalledWith(password, hashedPasword);
    });
  });
});
