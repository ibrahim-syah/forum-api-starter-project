const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 201 and persisted thread', async () => {
    // Arrange
    const requestPayload = {
      title: 'sebuah judul',
      body: 'sebuah body',
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

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    // Assert
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedThread).toBeDefined();
    expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
  });

  it('should response 400 if payload is incomplete', async () => {
    // Arrange
    const requestPayload = {
      title: 'sebuah judul',
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

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    // Assert
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
    expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
  });

  it('should response 400 if payload data type is invalid', async () => {
    // Arrange
    const requestPayload = {
      title: 123,
      body: true,
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

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    // Assert
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
    expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
  });

  it('should response code 200 when getting thread', async () => {
    // Arrange
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
        content: 'sebuah komentar',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddCommentJson = JSON.parse(responseAddComment.payload);
    const commentId = responseAddCommentJson.data.addedComment.id;

    // add another comment on the same thread
    const responseAddComment2 = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: 'komentar lain',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddComment2Json = JSON.parse(responseAddComment2.payload);
    const comment2Id = responseAddComment2Json.data.addedComment.id;

    // delete the second comment
    const responseDeleteComment = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${comment2Id}`,
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });

    // add reply to second comment
    const responseAddReply = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${comment2Id}/replies`,
      payload: {
        content: 'sebuah balasan',
      },
      headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
    });
    const responseAddReplyJson = JSON.parse(responseAddReply.payload);
    const replyId = responseAddReplyJson.data.addedReply.id;

    // Action
    const response = await server.inject({
      method: 'GET',
      url: `/threads/${threadId}`,
    });
    const responseJson = JSON.parse(response.payload);

    // Assert
    expect(responseJson.data.thread).toBeDefined();
    expect(responseJson.data.thread.id).toEqual(threadId);
    expect(responseJson.data.thread.title).toEqual('sebuah judul');
    expect(responseJson.data.thread.body).toEqual('sebuah body');
    expect(responseJson.data.thread.date).toBeDefined();
    expect(responseJson.data.thread.username).toEqual('dicoding');

    expect(responseJson.data.thread.comments).toHaveLength(2);
    expect(responseJson.data.thread.comments[0].id).toEqual(commentId);
    expect(responseJson.data.thread.comments[0].username).toEqual('dicoding');
    expect(responseJson.data.thread.comments[0].date).toBeDefined();
    expect(responseJson.data.thread.comments[0].content).toEqual('sebuah komentar');

    expect(responseJson.data.thread.comments[1].id).toEqual(comment2Id);
    expect(responseJson.data.thread.comments[1].username).toEqual('dicoding');
    expect(responseJson.data.thread.comments[1].date).toBeDefined();
    expect(responseJson.data.thread.comments[1].content).toEqual('**komentar telah dihapus**');

    expect(responseJson.data.thread.comments[1].replies).toHaveLength(1);
    expect(responseJson.data.thread.comments[1].replies[0].id).toEqual(replyId);
    expect(responseJson.data.thread.comments[1].replies[0].username).toEqual('dicoding');
    expect(responseJson.data.thread.comments[1].replies[0].date).toBeDefined();
    expect(responseJson.data.thread.comments[1].replies[0].content).toEqual('sebuah balasan');
  });
});
