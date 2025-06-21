import Fastify from 'fastify';
import { authRoutes } from './routes/auth';
import { profileRoutes } from './routes/profile';
import jwtPlugin from '../plugins/jwt';
import { docsRoutes } from './routes/docs';
import { env } from '../../env';

const app = Fastify();

async function start() {
  try {
    app.register(jwtPlugin);
    app.register(authRoutes);
    app.register(profileRoutes);
    app.register(docsRoutes);
    app.get('/', async () => {
      return {
        message: 'Welcome to the Tomo API!',
        documentation: `http://localhost:${env.port}/docs`,
        endpoints: {
          register: 'POST /register',
          login: 'POST /login',
          profile: 'GET /profile (requires authentication)',
        },
      };
    });

    app.listen({ port: env.port || 8080 }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`HTTP server running on http://localhost:${env.port}`);
      console.log(`📚 Documentation available at http://localhost:${env.port}/docs`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
