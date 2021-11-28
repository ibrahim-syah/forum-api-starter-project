const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('it should orchestrate the delete reply action correctly', async () => {
    const useCasePayload = {
      id: 'reply-123',
      owner: 'user-123',
      comment: 'comment-123',
      thread: 'thread-123',
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyAvailableReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.isAuthorized = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteReplyUseCase.execute(useCasePayload))
      .resolves.not.toThrowError(Error);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.comment);
    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.isAuthorized).toBeCalledWith(
      useCasePayload.id,
      useCasePayload.owner,
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.id);
  });
});
