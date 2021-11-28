/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
class GetThreadUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getAllCommentsOfThread(threadId);
    // consider using map!
    for (const comment of comments) {
      const replies = await this._replyRepository.getAllRepliesOfComment(comment.id);
      comment.replies = replies;
    }
    thread.comments = comments;

    return thread;
  }
}

module.exports = GetThreadUseCase;
