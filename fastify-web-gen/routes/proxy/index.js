'use strict';

const { Readable } = require('stream');
async function* upper(res) {
  for await (const chunk of res) {
    yield chunk.toString().toUpperCase();
  }
}
module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const { proxyUrl } = request.query;
    try {
      new URL(proxyUrl);
    } catch (err) {
      throw err;
    }
    return reply.from(proxyUrl);
  });

  fastify.get('/upper', async function (request, reply) {
    const { proxyUrl } = request.query;
    try {
      new URL(proxyUrl);
    } catch (err) {
      throw err;
    }
    return reply.from(proxyUrl, {
      onResponse(request, reply, res) {
        reply.send(Readable.from(upper(res)));
      },
    });
  });
};
