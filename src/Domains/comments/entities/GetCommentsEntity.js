/* eslint-disable camelcase */
class GetCommentsEntity {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    if (payload.is_delete) {
      this.content = '**komentar telah dihapus**';
    } else {
      this.content = payload.content;
    }
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, is_delete,
    } = payload;
    if (!id || !username || !date || !content || is_delete === undefined) {
      throw new Error('GET_COMMENTS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || !(typeof date === 'string' || typeof date === 'object')
      || typeof content !== 'string'
      || typeof is_delete !== 'boolean'
    ) {
      throw new Error('GET_COMMENTS_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetCommentsEntity;
