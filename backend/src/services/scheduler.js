/**
 * Scheduler Service for AgriConnect
 * Handles periodic tasks like market price syncing
 */
const cron = require('node-cron');
const { syncMarketPrices } = require('./marketPriceSyncService');
const logger = require('../utils/logger');

let pricesSyncTask = null;
let isRunning = false;

/**
 * Start the scheduler
 */
function start() {
  if (isRunning) {
    logger.warn('Scheduler already running');
    return;
  }
  
  // Schedule market price sync every 3 hours
  // Cron expression: 0 */3 * * * (at minute 0 of every 3rd hour)
  pricesSyncTask = cron.schedule('0 */3 * * *', async () => {
    logger.info('Scheduled market price sync triggered');
    try {
      await syncMarketPrices();
    } catch (error) {
      logger.error('Scheduled sync failed', { error: error.message });
    }
  }, {
    scheduled: true,
    timezone: 'Africa/Gaborone' // Botswana timezone
  });
  
  isRunning = true;
  logger.info('Scheduler started - Market prices sync every 3 hours');
  
  // Run initial sync after a short delay (give server time to fully start)
  setTimeout(async () => {
    logger.info('Running initial market price sync');
    try {
      await syncMarketPrices();
    } catch (error) {
      logger.error('Initial sync failed', { error: error.message });
    }
  }, 5000); // 5 second delay
}

/**
 * Stop the scheduler
 */
function stop() {
  if (pricesSyncTask) {
    pricesSyncTask.stop();
    pricesSyncTask = null;
  }
  isRunning = false;
  logger.info('Scheduler stopped');
}

/**
 * Manually trigger a sync (useful for admin endpoints)
 */
async function triggerSync() {
  logger.info('Manual market price sync triggered');
  return await syncMarketPrices();
}

/**
 * Get scheduler status
 */
function getStatus() {
  return {
    running: isRunning,
    nextRun: pricesSyncTask ? 'Every 3 hours' : null
  };
}

module.exports = {
  start,
  stop,
  triggerSync,
  getStatus
};









