const NewAuth = require('../../Domains/authentications/entities/NewAuth');

class LoginUseCase {
  constructor({ authenticationRepository, userRepository, tokenManager }) {
    this._authenticationRepository = authenticationRepository;
    this._userRepository = userRepository;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    const newAuth = new NewAuth(useCasePayload);

    const id = await this._userRepository.verifyUserCredential(newAuth);
    const accessToken = await this._tokenManager.generateAccessToken({ id });
    const refreshToken = await this._tokenManager.generateRefreshToken({ id });

    // add refresh token to database
    await this._authenticationRepository.addRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  }
}

module.exports = LoginUseCase;
