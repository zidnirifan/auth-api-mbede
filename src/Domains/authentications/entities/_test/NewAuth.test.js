const NewAuth = require('../NewAuth');

describe('a NewAuth Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'gedang',
    };

    expect(() => new NewAuth(payload)).toThrowError(
      'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: 123,
      password: true,
    };

    expect(() => new NewAuth(payload)).toThrowError(
      'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newAuth object correctly', () => {
    const payload = {
      username: 'jhondoe',
      password: 'password',
    };

    const { username, password } = new NewAuth(payload);

    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
});
