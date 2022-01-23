'use strict';
const fs = require('fs');
const path = require('path');

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const parentDir = path.resolve(__dirname, '..');
    fs.readFile(path.join(parentDir, 'README.md'), (err, fileBuffer) => {
      reply.send(err || fileBuffer);
    });
  });
};
