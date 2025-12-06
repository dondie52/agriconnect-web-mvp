/**
 * Logger Utility for AgriConnect
 * Handles logging for market price sync and other services
 */
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const LOG_FILE = path.join(logsDir, 'market-sync.log');

/**
 * Format timestamp for logging
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Write log entry to file and console
 */
function writeLog(level, message, data = null) {
  const timestamp = getTimestamp();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };
  
  const logLine = JSON.stringify(logEntry) + '\n';
  
  // Write to file
  try {
    fs.appendFileSync(LOG_FILE, logLine);
  } catch (error) {
    console.error('Failed to write to log file:', error.message);
  }
  
  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    const consoleMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    if (level === 'error') {
      console.error(consoleMessage, data || '');
    } else {
      console.log(consoleMessage, data ? JSON.stringify(data) : '');
    }
  }
}

const logger = {
  info: (message, data = null) => writeLog('info', message, data),
  warn: (message, data = null) => writeLog('warn', message, data),
  error: (message, data = null) => writeLog('error', message, data),
  debug: (message, data = null) => writeLog('debug', message, data),
  
  /**
   * Log sync start
   */
  syncStart: () => {
    writeLog('info', '=== Market Price Sync Started ===');
  },
  
  /**
   * Log sync completion
   */
  syncComplete: (stats) => {
    writeLog('info', '=== Market Price Sync Completed ===', stats);
  },
  
  /**
   * Log sync error
   */
  syncError: (error) => {
    writeLog('error', 'Market Price Sync Failed', { 
      message: error.message,
      stack: error.stack 
    });
  },
  
  /**
   * Log price update
   */
  priceUpdate: (crop, region, oldPrice, newPrice, changePercent) => {
    writeLog('info', 'Price Updated', {
      crop,
      region,
      oldPrice,
      newPrice,
      changePercent: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`
    });
  },
  
  /**
   * Log notification sent
   */
  notificationSent: (type, count, details) => {
    writeLog('info', 'Notifications Sent', {
      type,
      recipientCount: count,
      details
    });
  },
  
  /**
   * Log API fetch attempt
   */
  apiFetch: (source, success, details = null) => {
    writeLog(success ? 'info' : 'warn', `API Fetch: ${source}`, {
      success,
      ...details
    });
  }
};

module.exports = logger;

