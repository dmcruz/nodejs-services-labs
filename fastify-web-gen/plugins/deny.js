'use strict';

const fp = require('fastify-plugin');

module.exports = fp(async function (fastify, opts) {
  fastify.addHook('onRequest', async (request) => {
    if (request.ip === '200.200.200.1') {
      throw fastify.httpErrors.forbidden();
    }
  });
});
