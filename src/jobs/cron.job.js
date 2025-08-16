import * as DBService from '../DB/db.service.js'
import cron from 'node-cron';
import { TokenModel } from '../DB/models/Token.model.js';


cron.schedule('0 * * * *', async () => {
  // console.log('🔄 Running token cleanup job at', new Date());

  try {
    const now = Date.now();

    const result = await DBService.deleteMany({
      model: TokenModel,
      filter: {
        $expr: {
          $lt: [
            { $add: [ { $toLong: "$createdAt" }, "$expiresIn" ] },
            now
          ]
        }
      }
    });

    // console.log(`✅ Deleted ${result.deletedCount} expired tokens`);
  } catch (err) {
    // console.error('❌ Error deleting expired tokens:', err);
  }
});