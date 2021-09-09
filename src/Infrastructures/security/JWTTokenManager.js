const TokenManager = require('../../Applications/security/TokenManager');

class JWTTokenManager extends TokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  generateAccessToken(payload) {
    return this._jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  generateRefreshToken(payload) {
    return this._jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }
}

module.exports = JWTTokenManager;
