const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
