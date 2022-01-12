const got = require('got')

const { BOAT_SERVICE_PORT = 4444, BRAND_SERVICE_PORT = 5555 } = process.env

const boatSrv  = `http://localhost:${BOAT_SERVICE_PORT}`
const brandSrv = `http://localhost:${BRAND_SERVICE_PORT}`

module.exports = async function (fastify, opts) {
  fastify.get('/:id', async function (request, reply) {
    const { httpErrors } = fastify

    try {
      const {id} = request.params
      const boat = await got(`${boatSrv}/${id}`).json()
      const brand = await got(`${brandSrv}/${boat?.brand}`).json()
      return {
        id: boat?.id,
        color: boat?.color,
        brand: brand?.name
      }
    } catch(err) {
      if (!err.response) throw err
      else if (err.response.statusCode === 404) throw httpErrors.notFound()
      else if (err.response.statusCode === 400) throw httpErrors.badRequest()
      throw err
    }
  })
}