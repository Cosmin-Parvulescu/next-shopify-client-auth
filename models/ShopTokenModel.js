import mongoose from 'mongoose'

export default mongoose.models.ShopToken || mongoose.model('ShopToken', {
    shop: String,
    token: String
});