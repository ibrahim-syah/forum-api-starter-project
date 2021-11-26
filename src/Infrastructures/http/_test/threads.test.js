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
});
