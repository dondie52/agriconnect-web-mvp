/**
 * Seed Prices Script for AgriConnect
 * Seeds realistic Botswana market prices for all crops across key regions
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { query, pool } = require('../config/db');

// Realistic base prices for Botswana crops (in BWP/Pula per kg)
const CROP_PRICES = {
  'Maize': { base: 4.50, variance: 0.5 },
  'Sorghum': { base: 5.00, variance: 0.6 },
  'Millet': { base: 6.50, variance: 0.7 },
  'Cowpeas': { base: 12.00, variance: 1.5 },
  'Groundnuts': { base: 18.00, variance: 2.0 },
  'Beans': { base: 15.00, variance: 1.8 },
  'Tomatoes': { base: 8.50, variance: 1.2 },
  'Onions': { base: 7.00, variance: 0.8 },
  'Cabbage': { base: 5.50, variance: 0.6 },
  'Spinach': { base: 12.00, variance: 1.5 },
  'Carrots': { base: 9.00, variance: 1.0 },
  'Potatoes': { base: 6.50, variance: 0.7 },
  'Butternut': { base: 7.50, variance: 0.8 },
  'Green Pepper': { base: 14.00, variance: 1.6 },
  'Watermelon': { base: 3.50, variance: 0.4 },
  'Oranges': { base: 8.00, variance: 0.9 },
  'Mangoes': { base: 10.00, variance: 1.2 },
  'Pawpaw': { base: 9.50, variance: 1.1 },
  'Sunflower': { base: 7.00, variance: 0.8 },
  'Cotton': { base: 5.50, variance: 0.6 }
};

// Regional price modifiers (some regions have higher/lower prices)
const REGION_MODIFIERS = {
  'Gaborone': 1.05,      // Capital city - slightly higher
  'Francistown': 1.02,   // Second city
  'Maun': 1.00,          // Tourism hub
  'Molepolole': 0.98,
  'Serowe': 0.97,
  'Kgatleng': 0.99,
  'Kweneng': 0.98,
  'Central': 0.96,
  'North-East': 0.97,
  'North-West': 0.95,
  'Southern': 0.97,
  'South-East': 1.00,
  'Chobe': 0.94
};

/**
 * Generate a price with regional variance
 */
function generatePrice(cropName, regionName) {
  const cropInfo = CROP_PRICES[cropName];
  if (!cropInfo) return null;
  
  const regionMod = REGION_MODIFIERS[regionName] || 1.0;
  
  // Add some random variance
  const variance = (Math.random() - 0.5) * 2 * cropInfo.variance;
  const price = (cropInfo.base + variance) * regionMod;
  
  // Round to 2 decimal places
  return Math.round(price * 100) / 100;
}

/**
 * Generate a previous price (for change calculation)
 */
function generatePreviousPrice(currentPrice) {
  // Previous price varies by -5% to +5%
  const changePercent = (Math.random() - 0.5) * 0.1;
  return Math.round(currentPrice * (1 - changePercent) * 100) / 100;
}

async function seedPrices() {
  console.log('🌱 Starting price seeding...\n');
  
  try {
    // Get all crops
    const cropsResult = await query('SELECT id, name FROM crops');
    const crops = cropsResult.rows;
    console.log(`Found ${crops.length} crops`);
    
    // Get all regions
    const regionsResult = await query('SELECT id, name FROM regions');
    const regions = regionsResult.rows;
    console.log(`Found ${regions.length} regions`);
    
    // Key regions to seed (main markets)
    const keyRegions = ['Gaborone', 'Francistown', 'Maun', 'Central', 'Southern'];
    const regionsToSeed = regions.filter(r => keyRegions.includes(r.name));
    
    console.log(`\nSeeding prices for ${crops.length} crops × ${regionsToSeed.length} regions = ${crops.length * regionsToSeed.length} price entries\n`);
    
    let inserted = 0;
    let updated = 0;
    
    for (const crop of crops) {
      for (const region of regionsToSeed) {
        const price = generatePrice(crop.name, region.name);
        
        if (price) {
          const previousPrice = generatePreviousPrice(price);
          
          // Use upsert to handle existing entries
          const result = await query(
            `INSERT INTO prices (crop_id, region_id, price, previous_price, unit, updated_at)
             VALUES ($1, $2, $3, $4, 'kg', NOW())
             ON CONFLICT (crop_id, region_id)
             DO UPDATE SET 
               previous_price = prices.price,
               price = EXCLUDED.price,
               updated_at = NOW()
             RETURNING (xmax = 0) as inserted`,
            [crop.id, region.id, price, previousPrice]
          );
          
          if (result.rows[0]?.inserted) {
            inserted++;
          } else {
            updated++;
          }
          
          console.log(`  ${crop.name} in ${region.name}: P${price}/kg (prev: P${previousPrice})`);
        }
      }
    }
    
    console.log(`\n✅ Price seeding complete!`);
    console.log(`   Inserted: ${inserted}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Total: ${inserted + updated}\n`);
    
  } catch (error) {
    console.error('❌ Error seeding prices:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedPrices()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

module.exports = { seedPrices, generatePrice, CROP_PRICES, REGION_MODIFIERS };

