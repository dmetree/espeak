/**
 * Centralized utility for converting lesson price from USD cents to ADA/lovelace
 * This ensures consistent price conversion across all API endpoints
 */

/**
 * Fetches the current ADA/USD exchange rate from the internal API
 * @returns {Promise<number>} The ADA/USD exchange rate
 */
async function fetchAdaToUsdRate() {
  try {
    // Use internal API route which has caching
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/exchange-rate/ada-usd`);
    const data = await response.json();
    if (data.success && data.rate) {
      return data.rate;
    }
  } catch (error) {
    console.error("Failed to fetch ADA/USD rate from internal API:", error);
    // Try direct CoinGecko API as fallback (server-side, no CORS issue)
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd"
      );
      const data = await response.json();
      if (data.cardano?.usd) {
        return data.cardano.usd;
      }
    } catch (fallbackError) {
      console.error("Fallback CoinGecko API also failed:", fallbackError);
    }
  }
  // Fallback rate if API fails
  return 0.5;
}

/**
 * Converts price from USD cents to lovelace (for Cardano smart contracts)
 * @param {number} priceInCents - Price in USD cents (e.g., 1500 = $15.00)
 * @returns {Promise<number>} Price in lovelace (1 ADA = 1,000,000 lovelace)
 */
async function convertPriceToLovelace(priceInCents) {
  const adaToUsdRate = await fetchAdaToUsdRate();
  const priceInUSD = priceInCents / 100; // Convert cents to USD
  const priceInADA = priceInUSD / adaToUsdRate; // Convert USD to ADA
  const priceInLovelace = Math.round(priceInADA * 1_000_000); // Convert ADA to lovelace

  console.log(
    `Price conversion: ${priceInCents} cents = ${priceInUSD} USD = ${priceInADA} ADA (rate: ${adaToUsdRate}) = ${priceInLovelace} lovelace`
  );

  return priceInLovelace;
}

/**
 * Converts price from USD cents to ADA (for display purposes)
 * @param {number} priceInCents - Price in USD cents
 * @returns {Promise<number>} Price in ADA
 */
async function convertPriceToADA(priceInCents) {
  const adaToUsdRate = await fetchAdaToUsdRate();
  const priceInUSD = priceInCents / 100; // Convert cents to USD
  const priceInADA = priceInUSD / adaToUsdRate; // Convert USD to ADA
  return priceInADA;
}

module.exports = {
  fetchAdaToUsdRate,
  convertPriceToLovelace,
  convertPriceToADA,
};
