import 'regenerator-runtime/runtime';

import shopifyAuth from '@shopify/koa-shopify-auth';
import Shopify, { ApiVersion } from '@shopify/shopify-api';

import mongoose from 'mongoose';

import Cryptool from './cryptool';

import { TokenService } from './services';
import authRequest from './middleware';

import logger from './utils';

import Koa from 'koa';
import KoaRouter from '@koa/router';

import nextJs from 'next';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = nextJs({ dev });
const handle = app.getRequestHandler();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: ['read_customers'],
  HOST_NAME: process.env.HOST,
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: false,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const handleRequest = async (ctx) => {
  await handle(ctx.req, ctx.res);
  ctx.respond = false;
  ctx.res.statusCode = 200;
};

app.prepare().then(() => {
  const server = new Koa();
  const router = new KoaRouter();

  server.keys = [process.env.SHOPIFY_API_KEY];

  server.use(
    shopifyAuth({
      accessMode: 'offline',
      afterAuth: async (ctx) => {
        const { shop, accessToken } = ctx.state.shopify;

        logger.info(`${shop} authenticated`);

        await TokenService.upsertToken(shop, accessToken);

        ctx.cookies.set('shop', Cryptool.encrypt(JSON.stringify({ shop })), {
          signed: true,
          overwrite: true,
          secure: true,
        });

        logger.info(`${shop} cookies set`);

        await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: '/webhooks',
          topic: 'APP_UNINSTALLED',
          webhookHandler: async (_topic, shopName) => {
            logger.info(`Handling ${shop} uninstall`);
            await TokenService.removeToken(shopName);
          },
        });

        logger.info(`${shop} uninstall hook registered`);

        ctx.redirect('/');
        return;
      },
    }),
  );

  router.post('/webhooks', async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
    } catch (error) {
      logger.error(error);
    }
  });

  router.get('/install', handleRequest);

  router.get('(/_next/static/.*)', handleRequest);
  router.get('/_next/webpack-hmr', handleRequest);

  router.all('(.*)', authRequest, handleRequest);

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(router.routes());
  server.listen(port, () => {
    logger.info(`Server ready on http://localhost:${port}`);
  });
});
