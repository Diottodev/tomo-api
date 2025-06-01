import Fastify from 'fastify';
import { authRoutes } from './routes/auth';
import jwtPlugin from '../plugins/jwt';
import { env } from '../../env';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const app = Fastify();

async function start() {
  try {
    app.register(swagger, {
      swagger: {
        info: {
          title: 'Tomo Auth API',
          description: 'API for authentication with Fastify, JWT, and PostgreSQL',
          version: '1.0.0',
        },
        consumes: ['application/json'],
        produces: ['application/json'],
      },
    });

    app.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
    });

    app.register(jwtPlugin);
    app.register(authRoutes);

    app.get('/', async () => {
      return 'Welcome to the Tomo Auth API!';
    });

    app.listen({ port: env.port || 8080 }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`HTTP server running on http://localhost:${env.port}`);
      console.log(`Swagger docs available at http://localhost:${env.port}/docs`);
    });
    console.log(`HTTP server running on port ${env.port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
