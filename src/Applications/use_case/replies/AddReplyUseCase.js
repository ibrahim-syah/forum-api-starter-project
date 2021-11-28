const NewReply = require('../../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    await this._threadRepository.verifyAvailableThread(newReply.thread);
    await this._commentRepository.verifyAvailableComment(newReply.comment);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
