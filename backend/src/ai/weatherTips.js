/**
 * Weather Intelligence Engine for AgriConnect
 * Generates farming tips based on weather data
 */

module.exports = function weatherTips(weather) {
  if (!weather) {
    return "I can give you farming tips if you allow me to read the weather data.";
  }

  const { temperature, rainChance, windSpeed } = weather;

  let tips = [];

  // Rain-based advice
  if (rainChance > 40) {
    tips.push("Rain expected — good for planting beans, spinach, and leafy greens.");
  } else {
    tips.push("Low rain today — ideal for irrigation and planting drought-tolerant crops like sorghum.");
  }

  // Temperature-based advice
  if (temperature > 32) {
    tips.push("High heat — avoid midday spraying, water crops early morning.");
  }

  // Wind-based advice
  if (windSpeed > 15) {
    tips.push("Strong winds — avoid pesticide spraying.");
  }

  return tips.join(" ");
};


