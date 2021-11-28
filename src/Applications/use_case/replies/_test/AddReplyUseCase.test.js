const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');

describe('AddReplyUseCase', () => {
  it('it should orchestrate the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan',
      comment: 'comment-123',
      thread: 'thread-123',
      owner: 'user-123',
    };
    const expectedReply = new AddedReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn().mockImplementation(
      () => Promise.resolve(expectedReply),
    );

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    /** action */
    const addedReply = await addReplyUseCase.execute(useCasePayload);
    expect(addedReply).toStrictEqual(expectedReply);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.comment);
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      content: 'sebuah balasan',
      comment: 'comment-123',
      thread: 'thread-123',
      owner: 'user-123',
    }));
  });
});
