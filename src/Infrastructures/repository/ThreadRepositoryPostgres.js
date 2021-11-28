const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const GetThreadEntity = require('../../Domains/threads/entities/GetThreadEntity');
const CommentRepositoryPostgres = require('./CommentRepositoryPostgres');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };
    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread yang dituju tidak dapat ditemukan');
    }
  }

  async getThreadById(threadId, threadComments) {
    const query = {
      text: `SELECT threads.*, users.username FROM threads
      LEFT JOIN users ON users.id = threads.owner
      WHERE threads.id = $1`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    const thread = result.rows[0];
    thread.comments = threadComments;
    return new GetThreadEntity(thread);
  }
}

module.exports = ThreadRepositoryPostgres;
