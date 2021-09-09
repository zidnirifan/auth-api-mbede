const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    pool.end();
  });

  describe('addToken function', () => {
    it('should persist refresh token', async () => {
      const refreshToken = 'refresh_token';

      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool);

      await authenticationRepositoryPostgres.addRefreshToken(refreshToken);

      const token = await AuthenticationsTableTestHelper.findToken(
        refreshToken
      );
      expect(token).toHaveLength(1);
    });
  });
});
