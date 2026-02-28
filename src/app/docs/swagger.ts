import { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import openApiSpec from './openapi';

export const setupSwagger = (app: Application) => {
  if (process.env.ENABLE_SWAGGER !== 'true') {
    return;
  }

  app.get('/api/docs.json', (_req: Request, res: Response) => {
    res.json(openApiSpec);
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
};

