class GetThreadEntity {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.date;
    this.username = payload.username;
  }

  _verifyPayload(payload) {
    const {
      id, title, body, date, username,
    } = payload;

    if (!id || !title || !body || !date || !username) {
      throw new Error('GET_THREAD_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || !(typeof date === 'string' || typeof date === 'object')
      || typeof username !== 'string'
    ) {
      throw new Error('GET_THREAD_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadEntity;
