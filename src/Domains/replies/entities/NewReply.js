class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      content, comment, thread, owner,
    } = payload;

    this.content = content;
    this.comment = comment;
    this.thread = thread;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const {
      content, comment, thread, owner,
    } = payload;

    if (!content || !comment || !thread || !owner) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof content !== 'string' || typeof comment !== 'string' || typeof thread !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
