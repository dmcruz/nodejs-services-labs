'use strict'

const proxy = require('fastify-http-proxy')
module.exports = async function (fastify, opts) {
  fastify.register(proxy, {
    upstream: 'https://jsonplaceholder.typicode.com'
  })
}
