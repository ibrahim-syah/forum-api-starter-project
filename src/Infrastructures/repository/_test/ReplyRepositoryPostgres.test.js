const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should add reply correctly to database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const newReply = new NewReply({
        content: 'sebuah balasan',
        comment: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return addedReply entity correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const newReply = new NewReply({
        content: 'sebuah balasan',
        comment: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      }));
    });
  });

  describe('function verifyAvailableReply', () => {
    it('should not throw NotFoundError when reply existed', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123')).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when reply does not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('function isAuthorized', () => {
    it('should throw AuthorizationError when user is not authorized to access', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({}); // user-123
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({}); // added reply-123 as user-123

      const anotherUser = {
        id: 'user-456',
        username: 'bukanuserbiasa',
        password: '12345678',
        fullname: 'nama panjang',
      };
      await UsersTableTestHelper.addUser(anotherUser);

      // Action
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Assert
      expect(replyRepositoryPostgres.isAuthorized('reply-123', anotherUser.id))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error Authorization if user is authorized', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      // Action
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Assert
      expect(replyRepositoryPostgres.isAuthorized('reply-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('function deleteReply', () => {
    it('should delete Reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply('reply-123');

      // Assert
      const result = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe('function getAllRepliesOfThread', () => {
    it('should get all available and deleted replies of a thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({}); // thread-123
      await CommentsTableTestHelper.addComment({}); // comment-123
      await RepliesTableTestHelper.addReply({}); // reply with content, id = reply-123
      await RepliesTableTestHelper.addReply({
        id: 'reply-456', content: 'balasan lain', comment: 'comment-123', owner: 'user-123', is_delete: true,
      }); // deleted reply
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getAllRepliesOfComment('comment-123');

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].content).toEqual('sebuah balasan');
      expect(replies[0].username).toEqual('dicoding');
      expect(replies[0].date).toBeInstanceOf(Date);
      expect(replies[0].is_delete).toEqual(false);

      expect(replies[1].id).toEqual('reply-456');
      expect(replies[1].content).toEqual('**balasan telah dihapus**');
      expect(replies[1].username).toEqual('dicoding');
      expect(replies[1].date).toBeInstanceOf(Date);
      expect(replies[1].is_delete).toEqual(true);
    });
  });
});
