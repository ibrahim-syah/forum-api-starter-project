const NewThread = require('../../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  // consider making a test for authorization in here? in use case?
  it('it should orchestrate the adding thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah judul',
      body: 'sebuah body',
      owner: 'user-123',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'sebuah judul',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation(
      () => Promise.resolve(expectedAddedThread),
    );

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: 'sebuah judul',
      body: 'sebuah body',
      owner: 'user-123',
    }));
  });
});
