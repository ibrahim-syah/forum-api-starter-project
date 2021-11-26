const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId: thread } = request.params;
    request.payload.thread = thread; // add thread from params to payload
    request.payload.owner = owner; // add owner from auth credentials to payload

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;
