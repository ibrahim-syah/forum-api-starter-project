const GetCommentsEntity = require('../GetCommentsEntity');

describe('a GetCommentsEntity entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah komentar',
    };

    // Action and Assert
    expect(() => new GetCommentsEntity(payload)).toThrowError('GET_COMMENTS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 3.14,
      username: true,
      date: 'hari jumat',
      content: 'sebuah komentar',
      is_delete: 121,
    };

    // Action and Assert
    expect(() => new GetCommentsEntity(payload)).toThrowError('GET_COMMENTS_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('leave the content as is if is_delete is false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2021-11-26T23:19:06Z',
      content: 'sebuah komentar',
      is_delete: false,
    };

    // Action
    const {
      id, content, username, date,
    } = new GetCommentsEntity(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('set content to **komentar telah dihapus** if is_delete is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2021-11-26T23:19:06Z',
      content: 'sebuah komentar',
      is_delete: true,
    };

    // Action
    const {
      id, content, username, date,
    } = new GetCommentsEntity(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
  });
});
