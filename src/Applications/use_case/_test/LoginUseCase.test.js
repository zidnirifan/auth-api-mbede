const NewAuth = require('../../../Domains/authentications/entities/NewAuth');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const TokenManager = require('../../security/TokenManager');
const LoginUseCase = require('../LoginUseCase');
const PasswordHash = require('../../security/PasswordHash');

describe('LoginUseCase', () => {
  it('should orchestrating the login action correctly', async () => {
    const useCasePayload = {
      username: 'jhondoe',
      password: 'password',
    };

    const newAuth = new NewAuth(useCasePayload);

    const expectedTokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockUserRepository = new UserRepository();
    const mockTokenManager = new TokenManager();
    const mockPasswordHash = new PasswordHash();

    mockAuthenticationRepository.addRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getUserCredential = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: 'user-123', password: useCasePayload.password })
      );
    mockTokenManager.generateAccessToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedTokens.accessToken));
    mockTokenManager.generateRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedTokens.refreshToken));
    mockPasswordHash.compare = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const loginUseCase = new LoginUseCase({
      authenticationRepository: mockAuthenticationRepository,
      userRepository: mockUserRepository,
      tokenManager: mockTokenManager,
      passwordHash: mockPasswordHash,
    });

    // actions
    const tokens = await loginUseCase.execute(useCasePayload);

    const { password: hashedPassword } =
      await mockUserRepository.getUserCredential(newAuth.username);

    expect(tokens).toStrictEqual(expectedTokens);
    expect(mockAuthenticationRepository.addRefreshToken).toBeCalledWith(
      expectedTokens.refreshToken
    );
    expect(mockUserRepository.getUserCredential).toBeCalledWith(
      newAuth.username
    );
    expect(mockPasswordHash.compare).toBeCalledWith(
      newAuth.password,
      hashedPassword
    );
    expect(mockTokenManager.generateAccessToken).toBeCalledWith({
      id: 'user-123',
    });
    expect(mockTokenManager.generateRefreshToken).toBeCalledWith({
      id: 'user-123',
    });
  });
});
