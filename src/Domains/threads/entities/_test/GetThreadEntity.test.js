const GetThreadEntity = require('../GetThreadEntity');

describe('a GetThreadEntity entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'sebuah body',
    };

    // Action and Assert
    expect(() => new GetThreadEntity(payload)).toThrowError('GET_THREAD_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 12,
      title: true,
      body: 'sebuah body',
      date: 'hari jumat',
      username: true,
    };

    // Action and Assert
    expect(() => new GetThreadEntity(payload)).toThrowError('GET_THREAD_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('instantiate a new GetThreadEntity instance', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah judul',
      body: 'sebuah body',
      date: '2021-11-26T10:51:59Z',
      username: 'dicoding',
    };

    const getThreadEntity = new GetThreadEntity(payload);

    expect(getThreadEntity.id).toEqual(payload.id);
    expect(getThreadEntity.title).toEqual(payload.title);
    expect(getThreadEntity.body).toEqual(payload.body);
    expect(getThreadEntity.date).toEqual(payload.date);
    expect(getThreadEntity.username).toEqual(payload.username);
  });
});
