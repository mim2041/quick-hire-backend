const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'QuickHire Job Board API',
    version: '1.0.0',
    description:
      'RESTful API for the QuickHire Job Board. Supports job listing, job details, applications, and admin management.',
  },
  servers: [
    {
      url: 'http://localhost:9001',
      description: 'Local development',
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
    schemas: {
      Job: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'objectId' },
          title: { type: 'string' },
          company: { type: 'string' },
          location: { type: 'string' },
          category: { type: 'string' },
          description: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Application: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'objectId' },
          job: { type: 'string', format: 'objectId' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          resumeLink: { type: 'string', format: 'uri' },
          coverNote: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'objectId' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              role: { type: 'string', enum: ['admin', 'applicant'] },
            },
          },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          expiresIn: { type: 'string' },
        },
      },
      PaginatedJobs: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer' },
          success: { type: 'boolean' },
          message: { type: 'string' },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPage: { type: 'integer' },
            },
          },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Job' },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'integer' },
          success: { type: 'boolean' },
          message: { type: 'string' },
          path: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/jobs': {
      get: {
        summary: 'List jobs',
        description: 'Returns a paginated list of jobs with optional search and filters.',
        parameters: [
          {
            in: 'query',
            name: 'searchTerm',
            schema: { type: 'string' },
          },
          {
            in: 'query',
            name: 'category',
            schema: { type: 'string' },
          },
          {
            in: 'query',
            name: 'location',
            schema: { type: 'string' },
          },
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', minimum: 1 },
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1 },
          },
        ],
        responses: {
          200: {
            description: 'Jobs fetched successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedJobs' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create job (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'company', 'location', 'category', 'description'],
                properties: {
                  title: { type: 'string' },
                  company: { type: 'string' },
                  location: { type: 'string' },
                  category: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Job created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Job' },
              },
            },
          },
          401: { description: 'Unauthenticated' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/api/jobs/{id}': {
      get: {
        summary: 'Get job by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Job fetched successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Job' },
              },
            },
          },
          404: { description: 'Job not found' },
        },
      },
      delete: {
        summary: 'Delete job (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Job deleted successfully' },
          401: { description: 'Unauthenticated' },
          403: { description: 'Forbidden' },
          404: { description: 'Job not found' },
        },
      },
    },
    '/api/applications': {
      post: {
        summary: 'Submit job application',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['jobId', 'name', 'email', 'resumeLink', 'coverNote'],
                properties: {
                  jobId: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  resumeLink: { type: 'string', format: 'uri' },
                  coverNote: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Application submitted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Application' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Token refreshed' },
          401: { description: 'Invalid or expired refresh token' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        summary: 'Logout',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Profile fetched',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string' },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthenticated' },
        },
      },
    },
  },
};

export default openApiSpec;

