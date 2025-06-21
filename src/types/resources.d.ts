declare module 'fastify-jwt';
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string };
    user: { sub: string };
  }
}
declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';
  const swaggerUi: {
    serve: RequestHandler[];
    setup: (
      spec: object,
      options?: Record<string, unknown>,
      customCss?: string,
      customfavIcon?: string,
      swaggerUrl?: string,
      customSiteTitle?: string
    ) => RequestHandler;
  };
  export = swaggerUi;
}
declare module 'swagger-jsdoc' {
  interface SwaggerJSDocOptions {
    definition: object;
    apis: string[];
  }
  function swaggerJsdoc(options: SwaggerJSDocOptions): object;
  export = swaggerJsdoc;
}
