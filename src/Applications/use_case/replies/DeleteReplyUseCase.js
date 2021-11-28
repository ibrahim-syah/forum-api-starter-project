const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._threadRepository.verifyAvailableThread(deleteReply.thread);
    await this._commentRepository.verifyAvailableComment(deleteReply.comment);
    await this._replyRepository.verifyAvailableReply(deleteReply.id);
    await this._replyRepository.isAuthorized(deleteReply.id, deleteReply.owner);
    await this._replyRepository.deleteReply(deleteReply.id);
  }
}

module.exports = DeleteReplyUseCase;
