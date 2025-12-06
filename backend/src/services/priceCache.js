/**
 * Price Cache Service for AgriConnect
 * Simple in-memory cache with TTL for market prices
 * Used as fallback when external API is unavailable
 */

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds (fallback duration)

class PriceCache {
  constructor() {
    this.cache = new Map();
    this.lastSyncTime = null;
  }

  /**
   * Generate cache key from parameters
   */
  _generateKey(params = {}) {
    const { crop, region, crop_id, region_id } = params;
    const parts = ['prices'];
    if (crop || crop_id) parts.push(`crop_${crop || crop_id}`);
    if (region || region_id) parts.push(`region_${region || region_id}`);
    return parts.join('_');
  }

  /**
   * Get cached data if not expired
   */
  get(params = {}) {
    const key = this._generateKey(params);
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    // Check if expired
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return {
      data: cached.data,
      cached: true,
      cachedAt: new Date(cached.timestamp).toISOString(),
      lastSync: this.lastSyncTime
    };
  }

  /**
   * Set cache data
   */
  set(params = {}, data) {
    const key = this._generateKey(params);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Invalidate all cache entries
   */
  invalidateAll() {
    this.cache.clear();
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(params = {}) {
    const key = this._generateKey(params);
    this.cache.delete(key);
  }

  /**
   * Update last sync time
   */
  setLastSyncTime(time = new Date()) {
    this.lastSyncTime = time.toISOString();
  }

  /**
   * Get last sync time
   */
  getLastSyncTime() {
    return this.lastSyncTime;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      entries: this.cache.size,
      lastSync: this.lastSyncTime,
      ttlMinutes: CACHE_TTL / 60000
    };
  }
}

// Export singleton instance
module.exports = new PriceCache();

