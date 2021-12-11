'use strict'
const { bicycle } = require('../../model')

module.exports = async(fastify, opts) => {
  fastify.get('/:id', async (req, res) => {
    const {id} = req.params
    bicycle.read(id, (err, result) => {
      if(err) {
        if (err.message === 'not found') res.notFound()
        else res.send(err)
      } else {
        res.send(result)
      }
    })
    await res
  })
}