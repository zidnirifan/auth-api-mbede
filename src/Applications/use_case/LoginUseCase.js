const NewAuth = require('../../Domains/authentications/entities/NewAuth');

class LoginUseCase {
  constructor({
    authenticationRepository,
    userRepository,
    tokenManager,
    passwordHash,
  }) {
    this._authenticationRepository = authenticationRepository;
    this._userRepository = userRepository;
    this._tokenManager = tokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const newAuth = new NewAuth(useCasePayload);

    const { id, password: hashedPassword } =
      await this._userRepository.getUserCredential(newAuth.username);
    await this._passwordHash.compare(newAuth.password, hashedPassword);
    const accessToken = await this._tokenManager.generateAccessToken({ id });
    const refreshToken = await this._tokenManager.generateRefreshToken({
      id,
    });

    // add refresh token to database
    await this._authenticationRepository.addRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  }
}

module.exports = LoginUseCase;
