import Shopify from '@shopify/shopify-api';
import Cryptool from '../cryptool';
import { TokenService } from '../services';

async function authRequest(ctx, next) {
  const shopCookie = ctx.cookies.get('shop', { signed: true });
  if (!shopCookie) {
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

    const client = new Shopify.Clients.Rest(shop, token);

    // This throws a deprecation notice
    // but it's up to the NODE API library to
    // implement, hopefully
    await client.get({
      path: 'metafields',
      query: { limit: 1 },
    });

    await next();
    return;
  } catch (e) {
    if (e.code === 401) {
      ctx.redirect('/install');
    } else {
      throw e;
    }
  }
}

export default authRequest;
