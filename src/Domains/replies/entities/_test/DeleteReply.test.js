const DeleteReply = require('../DeleteReply');

describe('DeleteReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      comment: 'comment-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: true,
      comment: 12.3,
      thread: 123,
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('must create deleteReply entity Correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
      comment: 'comment-123',
      thread: 'thread-123',
    };

    // Action
    const {
      id, owner, comment, thread,
    } = new DeleteReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(comment).toEqual(payload.comment);
    expect(thread).toEqual(payload.thread);
  });
});
