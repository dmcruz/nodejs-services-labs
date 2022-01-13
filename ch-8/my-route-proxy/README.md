# Ch 08. Proxying HTTP Requests

## Steps

### Step 1: setup project (ch-8/my-route-proxy)

mkdir my-route-proxy
cd my-route-proxy
npm init fastify
npm install
npm install fastify-reply-from fastify-sensible

## Step 2: Modify app.js and register plugins

```js
..
const replyFrom = require('fastify-reply-from')
const sensible = require('fastify-sensible')

..
fastify.register(sensible)
fastify.register(replyFrom)
```

## Step 3: Modify routes/root.js

```js
'use strict'

module.exports = async function(fastify, opts) {
  fastify.get('/', async function(request, reply) {
    const { url } = request.query
    try {
      new URL(url)
    } catch(err) {
      throw fastify.httpErrors.badRequest()
    }
    return reply.from(url)
  })
}
```

## Step 4: Run server

Launch my-route-proxy
`npm run dev`

Open another terminal and run a server that will output hello world

`node -e "http.createServer((_, res) => (res.setHeader('Content-Type', 'text/plain'), res.end('hello world'))).listen(5000)"`

Open browser:

http://localhost:3000/?url=http://localhost:5000


## Step 5: Advance proxying scenario (transform response)

Modify routes/root.js

```js
'use strict'
const { Readable } = require('stream')
async function * upper (res) {
  for await (const chunk of res) {
    yield chunk.toString().toUpperCase()
  }
}

module.exports = async function(fastify, opts) {
  fastify.get('/', async function(request, reply) {
    const { url } = request.query

    try{
      new URL(url)
    } catch(err) {
      throw fastify.httpErrors.badRequest()
    }
    return reply.from(url, {
      onResponse(request, reply, res) {
        reply.send(Readable.from(upper(res)))
      }
    })
  })
}
```