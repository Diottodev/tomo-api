import type { FastifyInstance } from 'fastify';
import path from 'path';
import fs from 'fs';
import { ApiResponse } from '../../../utils/api-response';

export async function docsRoutes(app: FastifyInstance) {
  app.get('/docs', {
    handler: async (request, reply) => {
      const docsPath = path.join(__dirname, '../../../docs/index.html');
      try {
        const htmlContent = fs.readFileSync(docsPath, 'utf-8');
        return reply.type('text/html').send(htmlContent);
      } catch (error) {
        console.error('Docs route error:', error);
        return ApiResponse.notFound(reply, 'Documentation');
      }
    },
  });
}
