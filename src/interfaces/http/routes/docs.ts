import type { FastifyInstance } from 'fastify';
import path from 'path';
import fs from 'fs';

export async function docsRoutes(app: FastifyInstance) {
  app.get('/docs', {
    schema: {
      response: {
        200: {
          type: 'string',
          description: 'Página de documentação HTML',
        },
      },
    },
    handler: async (request, reply) => {
      const docsPath = path.join(__dirname, '../../../docs/index.html');
      try {
        const htmlContent = fs.readFileSync(docsPath, 'utf-8');
        reply.type('text/html').send(htmlContent);
      } catch {
        reply.status(404).send({ message: 'Documentation not found' });
      }
    },
  });
}
