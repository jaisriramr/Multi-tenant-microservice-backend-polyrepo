import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as proxy from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const server = app.getHttpAdapter().getInstance();

  app.use(
    '/user',
    proxy.createProxyMiddleware({
      target: 'http://localhost:3006',
      changeOrigin: true,
      pathRewrite: (path) => {
        console.log('Original Path:', path); // Log incoming path
        const rewrittenPath = path.replace(/^\/user/, '');
        console.log('Rewritten Path:', rewrittenPath); // Log forwarded path
        return '/user' + rewrittenPath;
      },
    }),
  );

  // Proxy for Organisation Service
  server.use(
    '/organisation',
    createProxyMiddleware({
      target: 'http://localhost:3002', // Replace with Organisation Service URL
      changeOrigin: true,
    }),
  );

  // Proxy for Project Service
  server.use(
    '/project',
    createProxyMiddleware({
      target: 'http://localhost:3009', // Replace with Project Service URL
      changeOrigin: true,
      pathRewrite: (path) => {
        const rewrittenPath = path.replace(/^\/project/, '');
        return '/project' + rewrittenPath;
      },
    }),
  );

  // proxy for task service
  server.use(
    '/task',
    createProxyMiddleware({
      target: 'http://localhost:3002', // Replace with Project Service URL
      changeOrigin: true,
      pathRewrite: (path) => {
        const rewrittenPath = path.replace(/^\/task/, '');
        return '/task' + rewrittenPath;
      },
    }),
  );

  // proxy for sprint service
  server.use(
    '/sprint',
    createProxyMiddleware({
      target: 'http://localhost:3004', // Replace with Project Service URL
      changeOrigin: true,
      pathRewrite: (path) => {
        const rewrittenPath = path.replace(/^\/sprint/, '');
        return '/sprint' + rewrittenPath;
      },
    }),
  );

  await app.listen(3000, () => console.log('Api Gateway'));
}
bootstrap();
