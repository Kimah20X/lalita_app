import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Lalita API',
    version: '1.0.0',
    description: 'Backend API for Lalita Fintech App',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  phoneNumber: { type: 'string' },
                  password: { type: 'string' },
                  fullName: { type: 'string' },
                  businessType: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  phoneNumber: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
        },
      },
    },
    '/dashboard/summary': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get dashboard summary',
        responses: {
          200: { description: 'Success' },
        },
      },
    },
    '/goals': {
      post: {
        tags: ['Savings'],
        summary: 'Create a savings goal',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  targetAmount: { type: 'number' },
                  frequency: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Goal created' },
        },
      },
      get: {
        tags: ['Savings'],
        summary: 'Get all savings goals',
        responses: {
          200: { description: 'Success' },
        },
      },
    },
    '/goals/{id}/deposit': {
      post: {
        tags: ['Savings'],
        summary: 'Deposit into a goal',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Success' },
        },
      },
    },
    '/ajo': {
      post: {
        tags: ['Ajo'],
        summary: 'Create an Ajo group',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  contributionAmount: { type: 'number' },
                  frequency: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Group created' },
        },
      },
      get: {
        tags: ['Ajo'],
        summary: 'Get all Ajo groups',
        responses: {
          200: { description: 'Success' },
        },
      },
    },
    '/ajo/{id}/join': {
      post: {
        tags: ['Ajo'],
        summary: 'Join an Ajo group',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Success' },
        },
      },
    },
    '/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'Get transaction history',
        responses: {
          200: { description: 'Success' },
        },
      },
    },
    '/wallet/deposit': {
      post: {
        tags: ['Wallet'],
        summary: 'Deposit to wallet',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Success' },
        },
      },
    },
    '/wallet/account': {
      get: {
        tags: ['Wallet'],
        summary: 'Get virtual bank account info',
        responses: {
          200: { description: 'Success' },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
