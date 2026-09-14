const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Football Players API',
      version: '1.0.0',
      description:
        'REST API built with Node.js and Express for managing football players.'
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server'
      }
    ],

    components: {
      schemas: {
        Player: {
          type: 'object',
          required: [
            'name',
            'age',
            'position',
            'team',
            'goals'
          ],

          properties: {
            id: {
              type: 'integer',
              example: 1
            },

            name: {
              type: 'string',
              example: 'Alex Johnson'
            },

            age: {
              type: 'integer',
              example: 24
            },

            position: {
              type: 'string',
              example: 'Defender'
            },

            team: {
              type: 'string',
              example: 'Farsta'
            },

            goals: {
              type: 'integer',
              example: 3
            }
          }
        }
      }
    },

    paths: {
      '/api/players': {
        get: {
          summary: 'Get all players',
          description:
            'Returns players. Supports filtering and pagination.',

          parameters: [
            {
              name: 'position',
              in: 'query',
              schema: {
                type: 'string'
              },
              description: 'Filter players by position'
            },

            {
              name: 'team',
              in: 'query',
              schema: {
                type: 'string'
              },
              description: 'Filter players by team'
            },

            {
              name: 'page',
              in: 'query',
              schema: {
                type: 'integer',
                default: 1
              },
              description: 'Page number'
            },

            {
              name: 'limit',
              in: 'query',
              schema: {
                type: 'integer',
                default: 10
              },
              description: 'Maximum number of players returned'
            }
          ],

          responses: {
            200: {
              description: 'List of players'
            },

            500: {
              description: 'Could not read player data'
            }
          }
        },

        post: {
          summary: 'Create a player',

          requestBody: {
            required: true,

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Player'
                }
              }
            }
          },

          responses: {
            201: {
              description: 'Player created'
            },

            400: {
              description: 'Invalid input'
            },

            500: {
              description: 'Could not save player'
            }
          }
        }
      },

      '/api/players/{id}': {
        get: {
          summary: 'Get one player',

          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],

          responses: {
            200: {
              description: 'Player found'
            },

            404: {
              description: 'Player not found'
            }
          }
        },

        put: {
          summary: 'Update a player',

          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],

          requestBody: {
            required: true,

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Player'
                }
              }
            }
          },

          responses: {
            200: {
              description: 'Player updated'
            },

            404: {
              description: 'Player not found'
            }
          }
        },

        delete: {
          summary: 'Delete a player',

          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],

          responses: {
            200: {
              description: 'Player deleted'
            },

            404: {
              description: 'Player not found'
            }
          }
        }
      }
    }
  },

  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;