'use strict';

const { promisify } = require('util');
const { players } = require('../../../model');
const getAll = promisify(players.getAll);
const read = promisify(players.read);
const create = promisify(players.create);
const update = promisify(players.update);
const del = promisify(players.del);

module.exports = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    return await getAll();
  });

  fastify.post('/', async (request, reply) => {
    const data = request.body;

    const id = await create(data);
    reply.code(201);
    return { id };
  });

  fastify.post('/:id', async (request, reply) => {
    const data = request.body;

    const { id } = request.params;
    try {
      return await update(id, data);
      //reply.code(204);
    } catch (err) {
      throw fastify.httpErrors.notFound();
    }
  });

  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      return await read(id);
    } catch (err) {
      throw fastify.httpErrors.notFound();
    }
  });

  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      await del(id);
      reply.code(201);
    } catch (err) {
      throw fastify.httpErrors.notFound();
    }
  });
};
