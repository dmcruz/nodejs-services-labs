# Notes
- [Notes](#notes)
  - [Core Http](#core-http)
    - [Basic code](#basic-code)
    - [Handling routes](#handling-routes)
    - [Testing the server](#testing-the-server)
  - [Fastify Web Server](#fastify-web-server)
    - [Generator](#generator)
    - [Static content](#static-content)
    - [Template Views](#template-views)
      - [1. Install](#1-install)
      - [2. Create view](#2-create-view)
    - [Streaming Content](#streaming-content)
    - [RESTful JSON Services](#restful-json-services)
    - [Route Validation](#route-validation)
      - [Post body schema validation](#post-body-schema-validation)
      - [Params schema validation](#params-schema-validation)
      - [Response schema validation](#response-schema-validation)
      - [More links](#more-links)
    - [Blocking IP Address](#blocking-ip-address)
  - [Express Web Server](#express-web-server)
    - [Basic code](#basic-code-1)
    - [Basic setup (manual setup)](#basic-setup-manual-setup)
    - [Generator](#generator-1)
    - [Static content](#static-content-1)
    - [Blocking IP Address](#blocking-ip-address-1)
    - [Testing](#testing)

## Core Http

### Basic code

Create server.js

```js
'use strict'
const http = require('http')
const PORT = process.env.PORT || 3000

const hello =`<html><body>Hello World</body></html>`
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.end(hello)
})
server.listen(PORT)
```

Execute: `node server.js`
Access: http://localhost:3000

### Handling routes

Snippet: 

```js
...
const url = require('url')
...
const { STATUS_CODES } = http
...
const root = '<html><body>Root</body></html>'
const hello = '<html><body>Hello World</body></html>'

if (req.method !== 'GET') {
  res.statusCode = 405
  res.end(STATUS_CODES[res.statusCode] + '\r\n')
  return
}
const { pathname } = url.parse(req.url)
if (pathname === '/') {
  res.end(root)
  return
}
if (pathname === '/hello') {
  res.end(hello)
  return
}
res.statusCode = 404
res.end(STATUS_CODES[res.statusCode] + '\r\n')
...
```

### Testing the server

Should return Method Not Allowed:
`node -e "http.request('http://localhost:3000', {method: 'POST'}, (res) => res.pipe(process.stdout)).end()"`

Another way
`curl -X POST http://localhost:3000`


## Fastify Web Server

### Generator

Check ch-4/fastify-web-gen

1. Creating new project:

```
mkdir fastify-web-gen
cd fastify-web-gen
npm init fastify
npm install
```

2. Bootstrap fastify in existing project (extends existing package.json with fastify):

```
cd fastify-web-gen
npm init fastify --integrate
```

for npm v7 above will have an issue, use this command instead:
```
npm init fastify -- --integrate
```

### Static content

Check ch-4/fastify-web-gen

Install:

`npm install fastify-static`

Code:

```js
// register
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/pub/',
})
```

### Template Views

Check ch-4/fastify-web-gen

#### 1. Install 

Install point of view rendering plugin and handlebar template engine

`npm install point-of-view handlebars`

Code:

```js
const pointOfView = require('point-of-view')
const handlebars = require('handlebars')

//... code redacted

fastify.register(pointOfView, {
  engine: { handlebars },
  root: path.join(__dirname, 'views'),
  layout: 'layout.hbs'
})
```

#### 2. Create view
1. create views folder
2. create a layout view: views/layout.hbs 

Code for templated view (`views/layout.hbs`)

```html
<html>
  <body>{{{ body }}}</body>
</html>
```

**Note**: 3 curly braces denote raw interpolation (html syntax will not be escaped)

1. create a partial view: views/hello.hbs

Code for partial view (`views/hello.hbs`)

``` html
<h1>{{ greeting }} World</h1>
```

**Note**: 2 curly braces will escape html characters

4. Render the partial view based on route (create `routes/hello/index.js`)

```js
'use strict'
module.exports = async(fastify, opts) => {
  fastify.get('/', async(req, reply) => {
    const { greeting = 'Hello '} = request.query
    return reply.view(`hello.hbs`, { greeting })
  })
}
```
### Streaming Content

```js
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
```

### RESTful JSON Services

### Route Validation 

See chapter 9

#### Post body schema validation
Snippet

```js
// Build schema object

const bodySchema = {
  type: 'object',
  required: ['data'],
  additionalProperties: false,
  properties: {
    data: {
      type: 'object',
      required: ['brand', 'color'],
      additionalProperties: false,
      properties: {
        brand: {type: 'string'},
        color: {type: 'string'}
      }
    }
  }
}
....
// Applying schema:
fastify.post('/', {
    schema: {
      body: bodySchema
    }
  }, async(request, reply) => {
  const { data } = request.body
  const id = uid()
  await create(id, data)
  reply.code(201)
  return { id }
})
```

#### Params schema validation

```js
const paramsSchema = {
  id: {
    type: 'integer'
  }
}
...
// apply schema where params is used such as fastify.get, fastify.delete or fastify.put
```

#### Response schema validation

```js

const dataSchema = {
  type: 'object',
  required: ['brand', 'color'],
  additionalProperties: false,
  properties: {
    brand: { type: 'string' },
    color: { type: 'string' }
  }
}

..
// apply 

{
  schema: { 
    response: {
      200: dataSchema
    }
  }
}
```

Another example

```js
const idSchema = { type: 'integer'}

...
// apply
{
  schema: {
    response: {
      '2xx': { id: idSchema }
    }
  }
}
```

#### More links
https://github.com/fastiy/fluent-schema
https://www.fastify.io/docs/latest/Testing

### Blocking IP Address

Create plugins/deny.js

```js
'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function(fastify, opts) {
  fastify.addHook('onRequest', async function (request) {
    if(request.ip === '127.0.0.1') {
      throw fastify.httpErrors.forbidden()
    }
  })
})
```

## Express Web Server


### Basic code

app.js

``` js
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}/`)
})
```
Run `node app.js`

### Basic setup (manual setup)

Structure 

```
|--/express-web-server
    |--app.js
    |--/routes
        |--index.js
        |--hello.js
    |--/bin
        |--www
```

1. npm init -y
2. npm install express@4 http-errors@1
3. modify package.json; start command: "node ./bin/www"
4. Modify app.js

```js
'use strict'
const express = require('express')
const app = express()
module.exports = app
```

5. Modify bin/www

```js
#!/usr/bin/env node
'use strict'
const app = require('../app')
const http = require('http')
const PORT = process.env.PORT || 3000
const server = http.createServer(app)
server.listen(PORT)
```

   
### Generator

Alternative to setting up a new express web server is to use a generator to generate boilerplate

`npm install -g express-generator@4`

`express --hbs express-web-server`

### Static content

```js
app.use(express.static(path.join(__dirname, 'public')));
```

or to define virtual directory:
```js
app.use('/public', express.static(path.join(__dirname, 'public')));
```

### Blocking IP Address

```js
app.use(function(req, res, next) {
  if(req.socket.remoteAddress === '127.0.0.1') {
    const err = new Error('Forbidden')
    err.status = 403
    next(err)
    return
  }
  next()
})
```


### Testing

`node -e "http.request('http://localhost:3000/bicycle/3/update', { method: 'post', headers: {'content-type': 'application/json'}}, (res) => console.log(res.statusCode)).end(JSON.stringify({data: {brand: 'Ampler', color: 'blue'}}))"`
