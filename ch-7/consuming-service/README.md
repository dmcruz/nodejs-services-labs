# Getting Started with Fastify-CLI [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Steps

### Step 0: run mock services (ch-7/mock-services)

Open terminal

`PORT=4000 node bicycle-service.js`

Open another terminal

`PORT=5000 node brand-service.js`

### Step 1: setup project (ch-7/consuming-service)

mkdir consuming-service
cd consuming-service
npm init fastify
npm install
npm install got

## Step 2: change routes/root.js

```javascript
const got = require('got')

const { BICYCLE_SERVICE_PORT = 4000 } = process.env

const bicycleSrv  = `http://localhost:${BICYCLE_SERVICE_PORT}`

module.exports = async function (fastify, opts) {
  fastify.get('/:id', async function (request, reply) {
    const {id} = request.params
    const bicycle = await got(`${bicycleSrv}/${id}`).json()
    return bicycle
  })
}
```

### Step 3: Run server

`npm run dev`

http://localhost:3000/1 should return response

### Step 4. Combining data

Modify routes/root.js


```js
'use strict'
const got = require('got')

const { BICYCLE_SERVICE_PORT = 4000, BRAND_SERVICE_PORT = 5000 } = process.env

const bicycleSrv  = `http://localhost:${BICYCLE_SERVICE_PORT}`
const brandSrv = `http://localhost:${BRAND_SERVICE_PORT}`

module.exports = async function (fastify, opts) {
  fastify.get('/:id', async function (request, reply) {
    const {id} = request.params
    const bicycle = await got(`${bicycleSrv}/${id}`).json()
    const brand = await got(`${brandSrv}/${id}`).json()
    return {
      id: bicycle.id,
      color: bicycle.color,
      brand: brand.name
    }
  })
}

```

### Step 5: Handling error codes

1. Check status of success case

`node -e "http.get('http://localhost:3000/1', (res) => console.log(res.statusCode))"`

Result: 200

2. Check status of a fail case

`node -e "http.get('http://localhost:3000/2', (res) => console.log(res.statusCode))"`

Result: 500

3. Handle error and show 404 (not found)


  3.1  Modify routes/root.js

      ```js
      'use strict'
      const got = require('got')

      const {
        BICYCLE_SERVICE_PORT = 4000, BRAND_SERVICE_PORT = 5000
      } = process.env

      const bicycleSrv = `http://localhost:${BICYCLE_SERVICE_PORT}`
      const brandSrv = `http://localhost:${BRAND_SERVICE_PORT}`

      module.exports = async function (fastify, opts) {
        const { httpErrors } = fastify
        fastify.get('/:id', async function (request, reply) {
          const { id } = request.params
          try {
            const [ bicycle, brand ] = await Promise.all([
              got(`${bicycleSrv}/${id}`).json(),
              got(`${brandSrv}/${id}`).json()
            ])
            return {
              id: bicycle.id,
              color: bicycle.color,
              brand: brand.name,
            }
          } catch (err) {
            if (!err.response) throw err
            if (err.response.statusCode === 404) {
              throw httpErrors.notFound()
            }
            else if (err.response.statusCode === 400) {
              throw httpErrors.badRequest()
            }
            throw err
          }
        })
      }
      ```