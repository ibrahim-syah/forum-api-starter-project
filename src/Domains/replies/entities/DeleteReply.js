class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, comment, thread, owner,
    } = payload;

    this.id = id;
    this.comment = comment;
    this.thread = thread;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const {
      id, comment, thread, owner,
    } = payload;

    if (!id || !comment || !thread || !owner) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof comment !== 'string' || typeof thread !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
