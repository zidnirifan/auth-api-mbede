const Jwt = require('@hapi/jwt');
const JWTTokenManager = require('../JWTTokenManager');

describe('TokenManager', () => {
  describe('generateAccessToken function', () => {
    it('should generate access token correctly', async () => {
      const spyJwt = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JWTTokenManager(Jwt);

      const accessToken = await jwtTokenManager.generateAccessToken({
        id: 'user-123',
      });

      expect(typeof accessToken).toEqual('string');
      expect(spyJwt).toBeCalledWith(
        { id: 'user-123' },
        process.env.ACCESS_TOKEN_KEY
      );
    });

    describe('generateRefreshToken function', () => {
      it('should generate access token correctly', async () => {
        const spyJwt = jest.spyOn(Jwt.token, 'generate');
        const jwtTokenManager = new JWTTokenManager(Jwt);

        const refreshToken = await jwtTokenManager.generateRefreshToken({
          id: 'user-123',
        });

        expect(typeof refreshToken).toEqual('string');
        expect(spyJwt).toBeCalledWith(
          { id: 'user-123' },
          process.env.REFRESH_TOKEN_KEY
        );
      });
    });
  });
});
