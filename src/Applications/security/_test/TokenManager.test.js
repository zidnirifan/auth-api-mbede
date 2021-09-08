const TokenManager = require('../TokenManager');

describe('TokenManager interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const tokenManager = new TokenManager();

    await expect(tokenManager.generateAccessToken({})).rejects.toThrowError(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );

    await expect(tokenManager.generateRefreshToken({})).rejects.toThrowError(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );

    await expect(tokenManager.verifyRefreshToken({})).rejects.toThrowError(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );
  });
});
