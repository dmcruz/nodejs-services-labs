# Ch 08. Proxying HTTP Requests

## Steps

### Step 1: setup project (ch-8/my-proxy)

mkdir my-proxy
cd my-proxy
npm init fastify
npm install
npm install fastify-http-proxy

## Step 2: Modify app.js

```js
const proxy = require('fastify-http-proxy')
module.exports = async function(fastify, opts) {
  fastify.register(proxy, {
    upstream: 'https://news.ycombinator.com/'
  })
}
```

Run the server: `npm run dev`

http://localhost:3000 will return the upstream site

## Step 3: Implement custom authentication logic

Install fastify-sensible

`npm install fastify-sensible`

Modify app.js

```js
'use strict'

const proxy = require('fastify-http-proxy')
const sensible = require('fastify-sensible')
module.exports = async function (fastify, opts) {
  fastify.register(sensible)
  fastify.register(proxy, {
    upstream: 'https://news.ycombinator.com/',
    async preHandler(request, reply) {
      if (request.query.token !== 'abc') {
        throw fastify.httpErrors.unauthorized()
      }
    }
  })

}
```

http://localhost:3000 results in unauthorized

http://localhost:3000/?token=abc will return the upstream site
