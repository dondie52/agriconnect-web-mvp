/**
 * Smart Crop Advisor for AgriConnect
 * Provides Botswana-specific seasonal planting advice
 */

module.exports = function cropAdvisor(message) {
  const month = new Date().getMonth() + 1;

  // Planting season (September - December)
  if (month >= 9 && month <= 12) {
    return "This is planting season in Botswana. Ideal crops: maize, sorghum, beans, groundnuts, watermelon.";
  }

  // Growing/maintenance season (January - March)
  if (month >= 1 && month <= 3) {
    return "Good time for weeding, fertilizer application, and maintaining moisture for maize and legumes.";
  }

  // Harvest season (April - June)
  if (month >= 4 && month <= 6) {
    return "Harvest season for maize, beans, and groundnuts. Ensure proper drying and storage.";
  }

  // Dry season (July - August)
  return "Dry season — focus on irrigation crops like tomatoes, cabbage, spinach, and onions.";
};


