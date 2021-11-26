const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('it should orchestrate the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah komentar',
      thread: 'thread-123',
      owner: 'user-123',
    };
    const expectedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah komentar',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(
      () => Promise.resolve(expectedComment),
    );

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    /** action */
    const addedComment = await addCommentUseCase.execute(useCasePayload);
    expect(addedComment).toStrictEqual(expectedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: 'sebuah komentar',
      thread: 'thread-123',
      owner: 'user-123',
    }));
  });
});
