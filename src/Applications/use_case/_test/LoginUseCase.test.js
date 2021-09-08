const NewAuth = require('../../../Domains/authentications/entities/NewAuth');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const TokenManager = require('../../security/TokenManager');
const LoginUseCase = require('../LoginUseCase');

describe('LoginUseCase', () => {
  it('should orchestrating the login action correctly', async () => {
    const useCasePayload = {
      username: 'jhondoe',
      password: 'password',
    };

    const expectedTokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();

    mockAuthenticationRepository.addRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.verifyUserCredential = jest
      .fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockTokenManager.generateAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedTokens.accessToken));
    mockTokenManager.generateRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedTokens.refreshToken));

    // creating use case instance
    const loginUseCase = new LoginUseCase({
      authenticationRepository: mockAuthenticationRepository,
      userRepository: mockUserRepository,
      tokenManager: mockTokenManager,
    });

    // actions
    const tokens = await loginUseCase.execute(useCasePayload);

    expect(tokens).toStrictEqual(expectedTokens);
    expect(mockAuthenticationRepository.addRefreshToken).toBeCalledWith(
      expectedTokens.refreshToken
    );
    expect(mockUserRepository.verifyUserCredential).toBeCalledWith(
      new NewAuth({
        username: useCasePayload.username,
        password: useCasePayload.password,
      })
    );
    expect(mockTokenManager.generateAccessToken).toBeCalledWith({
      id: 'user-123',
    });
    expect(mockTokenManager.generateRefreshToken).toBeCalledWith({
      id: 'user-123',
    });
  });
});
