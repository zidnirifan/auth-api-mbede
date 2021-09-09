const LoginUseCase = require('../../../../Applications/use_case/LoginUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;

    this.postAuthentication = this.postAuthentication.bind(this);
  }

  async postAuthentication({ payload }, h) {
    const loginUseCase = this._container.getInstance(LoginUseCase.name);
    const tokens = await loginUseCase.execute(payload);

    return h
      .response({
        status: 'success',
        data: { ...tokens },
      })
      .code(201);
  }
}

module.exports = AuthenticationsHandler;
