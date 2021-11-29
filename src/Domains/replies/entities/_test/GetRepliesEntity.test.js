/* eslint-disable camelcase */
const GetRepliesEntity = require('../GetRepliesEntity');

describe('a GetRepliesEntity entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan',
    };

    // Action and Assert
    expect(() => new GetRepliesEntity(payload)).toThrowError('GET_REPLIES_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 3.14,
      content: 'sebuah balasan',
      date: 'hari jumat',
      username: true,
      is_delete: 121,
    };

    // Action and Assert
    expect(() => new GetRepliesEntity(payload)).toThrowError('GET_REPLIES_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('leave the content as is if is_delete is false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-11-26T23:19:06Z',
      username: 'user-123',
      is_delete: false,
    };

    // Action
    const {
      id, content, username, date, is_delete,
    } = new GetRepliesEntity(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(is_delete).toEqual(false);
  });

  it('set content to **balasan telah dihapus** if is_delete is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-11-26T23:19:06Z',
      username: 'user-123',
      is_delete: true,
    };

    // Action
    const {
      id, content, username, date, is_delete,
    } = new GetRepliesEntity(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(is_delete).toEqual(true);
  });
});
