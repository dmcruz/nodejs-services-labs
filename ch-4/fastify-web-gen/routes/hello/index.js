'use strict';

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const { greeting = 'Hello', author = 'John' } = request.query;
    return reply.view(`hello.hbs`, { author: { name: author }, greeting });
  });
};
