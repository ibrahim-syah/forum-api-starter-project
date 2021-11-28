const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should response code 201 along with the added reply', async () => {
    // Arrange
    const requestPayload = {
      content: 'sebuah balasan',
    };

    const server = await createServer(container);

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login with said user
    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const responseAuthJson = JSON.parse(responseAuth.payload); // get the acces token

    // add thread
    const responseAddThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah judul',
        body: 'sebuah body',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddThreadJson = JSON.parse(responseAddThread.payload);
    const threadId = responseAddThreadJson.data.addedThread.id;

    // add comment
    const responseAddComment = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: 'sebuah balasan',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddCommentJson = JSON.parse(responseAddComment.payload);
    const commentId = responseAddCommentJson.data.addedComment.id;

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    // Assert
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedReply).toBeDefined();
    expect(responseJson.data.addedReply.content).toEqual(requestPayload.content);
  });

  it('should response code 400 if payload is incomplete', async () => {
    // Arrange
    const requestPayload = {
    };

    const server = await createServer(container);

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login with said user
    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const responseAuthJson = JSON.parse(responseAuth.payload); // get the acces token

    // add thread
    const responseAddThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah judul',
        body: 'sebuah body',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddThreadJson = JSON.parse(responseAddThread.payload);
    const threadId = responseAddThreadJson.data.addedThread.id;

    // add comment
    const responseAddComment = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: 'sebuah balasan',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddCommentJson = JSON.parse(responseAddComment.payload);
    const commentId = responseAddCommentJson.data.addedComment.id;

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    // Assert
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
    expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
  });

  it('should response code 400 if payload data type is invalid', async () => {
    // Arrange
    const requestPayload = {
      content: 123,
    };

    const server = await createServer(container);

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login with said user
    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const responseAuthJson = JSON.parse(responseAuth.payload); // get the acces token

    // add thread
    const responseAddThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah judul',
        body: 'sebuah body',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddThreadJson = JSON.parse(responseAddThread.payload);
    const threadId = responseAddThreadJson.data.addedThread.id;

    // add comment
    const responseAddComment = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: 'sebuah balasan',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddCommentJson = JSON.parse(responseAddComment.payload);
    const commentId = responseAddCommentJson.data.addedComment.id;

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    // Assert
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
    expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
  });

  it('should response code 404 if the comment does not exist', async () => {
    // Arrange
    const requestPayload = {
      content: 'sebuah balasan',
    };

    const server = await createServer(container);

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login with said user
    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const responseAuthJson = JSON.parse(responseAuth.payload); // get the acces token

    // add thread
    const responseAddThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah judul',
        body: 'sebuah body',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddThreadJson = JSON.parse(responseAddThread.payload);
    const threadId = responseAddThreadJson.data.addedThread.id;

    // Action
    const commentId = 'comment-123';
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    // Assert
    expect(response.statusCode).toEqual(404);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
    expect(responseJson.message).toEqual('komentar tidak ditemukan');
  });

  it('should respond code 200 when succesfully deleted comment', async () => {
    // Arrange
    const requestPayload = {
      content: 'sebuah balasan',
    };

    const server = await createServer(container);

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login with said user
    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const responseAuthJson = JSON.parse(responseAuth.payload); // get the acces token

    // add thread
    const responseAddThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah judul',
        body: 'sebuah body',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddThreadJson = JSON.parse(responseAddThread.payload);
    const threadId = responseAddThreadJson.data.addedThread.id;

    // add comment
    const responseAddComment = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: 'sebuah balasan',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddCommentJson = JSON.parse(responseAddComment.payload);
    const commentId = responseAddCommentJson.data.addedComment.id;

    // add Reply
    const responseAddReply = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddReplyJson = JSON.parse(responseAddReply.payload);
    const replyId = responseAddReplyJson.data.addedReply.id;

    // Action
    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
  });
});
