import "regenerator-runtime/runtime";

import shopifyAuth from '@shopify/koa-shopify-auth';
import Shopify, { ApiVersion } from '@shopify/shopify-api';

const Koa = require('koa')
const next = require('next')
const Router = require('@koa/router')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: ['read_customers'],
  HOST_NAME: process.env.HOST,
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: false,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
})

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.keys = [process.env.SHOPIFY_API_KEY];

  server.use(
    shopifyAuth({
      accessMode: 'offline',
      afterAuth: async (ctx) => {
        const { shop, accessToken } = ctx.state.shopify;

        console.log(`${shop}_${accessToken}`);

        ctx.redirect('/');
      }
    }),
  );

  router.all('(.*)', async (ctx) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router.routes())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
