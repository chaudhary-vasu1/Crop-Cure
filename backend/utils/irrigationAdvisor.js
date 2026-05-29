/**
 * Computes watering advice based on weather and soil type.
 * @param {object} weather - Data from weatherService
 * @param {string} soilType - 'Loamy', 'Clay', 'Sandy', or 'Silt'
 * @returns {object} - Structured advice
 */
export const calculateIrrigationNeeds = (weather, soilType) => {
    let advice = "Maintain standard watering schedule.";
    let waterVolume = "Moderate";
    let frequency = "Every 2-3 days";

    // 1. Evaluate Weather Impact
    if (weather.condition === 'Rain' || weather.rainfallAmount > 5) {
        return {
            action: 'Pause Irrigation',
            waterVolume: 'None',
            frequency: 'N/A',
            reason: `Natural rainfall detected (${weather.condition}). Watering is unnecessary.`,
            urgency: 'Low'
        };
    }

    if (weather.temp > 32) {
        waterVolume = "High";
        frequency = "Daily (Early Morning or Late Evening)";
        advice = "High temperatures detected. Increase watering to prevent heat stress and minimize evaporation.";
    }

    // 2. Adjust for Soil Type Characteristics
    switch (soilType.toLowerCase()) {
        case 'sandy':
            // Drains quickly, needs frequent, lighter watering
            frequency = weather.temp > 30 ? "Twice Daily" : "Daily";
            advice += " Sandy soil drains rapidly. Apply water more frequently in smaller amounts.";
            break;
        case 'clay':
            // Retains water, prone to waterlogging
            frequency = weather.temp > 30 ? "Every 2 days" : "Every 3-4 days";
            waterVolume = "Low to Moderate";
            advice += " Clay soil retains moisture well. Avoid overwatering to prevent root rot.";
            break;
        case 'loamy':
        case 'silt':
            // Ideal balance
            advice += " Your loamy/silt soil holds moisture well but drains adequately.";
            break;
        default:
            break;
    }

    return {
        action: 'Irrigate',
        waterVolume,
        frequency,
        reason: advice,
        urgency: weather.temp > 35 ? 'High' : 'Normal'
    };
};