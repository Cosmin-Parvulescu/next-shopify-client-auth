import ShopToken from '../models';
import Cryptool from '../cryptool';
import logger from '../utils';

export default class TokenService {
  static async getTokenByShop(shop) {
    logger.info(`${shop} is requesting token from DB`);

    try {
      const shopTokenDbEntry = await ShopToken.findOne({ shop }).exec();
      const decryptedToken = Cryptool.decrypt(shopTokenDbEntry.token);

      logger.info(`${shop} token returned`);

      return decryptedToken;
    } catch (ex) {
      logger.warn(`${shop} token retrieval failure`);
    }

    return null;
  }

  static async upsertToken(shop, token) {
    logger.info(`${shop} is requesting token upsert in DB`);

    try {
      await ShopToken.findOneAndUpdate({
        shop,
      }, {
        shop,
        token: Cryptool.encrypt(token),
      }, {
        upsert: true,
      });

      logger.info(`${shop} token upserted`);
    } catch (ex) {
      logger.warn(`${shop} token upsert failure`);
    }
  }

  static async removeToken(shop) {
    logger.info(`${shop} is requesting token removal from DB`);

    await ShopToken.deleteOne({ shop }).exec();

    logger.info(`${shop} token removed`);
  }
}
