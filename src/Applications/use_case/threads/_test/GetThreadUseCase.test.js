const GetCommentsEntity = require('../../../../Domains/comments/entities/GetCommentsEntity');
const GetThreadEntity = require('../../../../Domains/threads/entities/GetThreadEntity');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const GetRepliesEntity = require('../../../../Domains/replies/entities/GetRepliesEntity');

describe('GetThreadUseCase', () => {
  it('it should orchecstrate the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const expectedReplies = [
      new GetRepliesEntity({
        id: 'reply-123',
        content: 'sebuah komentar',
        date: '2021-11-28T03:46:19Z',
        username: 'dicoding',
        is_delete: false,
      }),
    ];
    const expectedComments = [
      new GetCommentsEntity({
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-11-28T03:46:19Z',
        content: 'sebuah komentar',
        is_delete: false,
      }),
    ];
    const expectedThread = new GetThreadEntity({
      id: 'thread-123',
      title: 'sebuah judul',
      body: 'sebuah body',
      date: '2021-11-28T03:46:19Z',
      username: 'dicoding',
      comments: expectedComments,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getAllCommentsOfThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getAllRepliesOfComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });
    const threadResult = await getThreadUseCase.execute(threadId);
    // Assert
    expect(threadResult).toStrictEqual(expectedThread);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getAllCommentsOfThread).toBeCalledWith(threadId);
    expect(mockReplyRepository.getAllRepliesOfComment).toBeCalledWith(commentId);
  });
});
