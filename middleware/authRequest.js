import Shopify from '@shopify/shopify-api';
import Cryptool from '../cryptool';
import { TokenService } from '../services';
import logger from '../utils';

async function authRequest(ctx, next) {
  logger.info('Authenticating request');

  const shopCookie = ctx.cookies.get('shop', { signed: true });
  if (!shopCookie) {
    logger.warn('No auth cookie present, redirecting to auth');

    ctx.redirect('/install');
    return;
  }

  const shopData = JSON.parse(Cryptool.decrypt(shopCookie));
  const { shop } = shopData;

  try {
    const token = await TokenService.getTokenByShop(shop);
    if (token === null) {
      ctx.redirect('/install');
      return;
    }

    logger.info(`Validated ${shop} database token`);

    const client = new Shopify.Clients.Rest(shop, token);
    await client.get({
      path: 'metafields',
      query: { limit: 1 },
    });

    logger.info(`Validated ${shop} shopify token`);
    logger.info('Request authenticated');

    await next();
  } catch (e) {
    if (e.code === 401) {
      logger.warn(`Shopify API connection unauthorized for ${shop}`);

      ctx.redirect('/install');
      return;
    } else {
      logger.error(`Authentication failed for ${shop}: ${e}`);

      throw e;
    }
  }
}

export default authRequest;
