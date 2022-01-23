'use strict';
const got = require('got');

module.exports = async function (fastify, opts) {
  fastify.get('/starships', async function (request, reply) {
    return await got('https://swapi.dev/api/starships').json();
  });

  fastify.get('/ownerStarships/:personId', async function (request, reply) {
    const { personId } = request.params;

    try {
      const person = await got(
        `https://swapi.dev/api/people/${personId}`
      ).json();
      const starships = await Promise.all(
        person.starships.map((s) => got(s).json())
      );
      return {
        name: person.name,
        starships: starships.map((s) => {
          return { name: s.name, model: s.model, class: s.starship_class };
        }),
      };
    } catch (err) {
      if (err.response?.statusCode === 404) {
        throw fastify.httpErrors.notFound();
      } else if (err.response?.statusCode === 400) {
        throw fastify.httpErrors.badRequest();
      }
      throw err;
    }
  });
};
