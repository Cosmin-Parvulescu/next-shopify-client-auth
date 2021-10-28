import ShopToken from '../models';
import Cryptool from '../cryptool';

export default class TokenService {
  static async getTokenByShop(shop) {
    const shopTokenDbEntry = await ShopToken.findOne({ shop }).exec();
    return shopTokenDbEntry ? Cryptool.decrypt(shopTokenDbEntry.token) : null;
  }

  static async upsertToken(shop, token) {
    await ShopToken.findOneAndUpdate({
      shop,
    }, {
      shop,
      token: Cryptool.encrypt(token),
    }, {
      upsert: true,
    });
  }

  static async removeToken(shop) {
    await ShopToken.deleteOne({ shop }).exec();
  }
}
