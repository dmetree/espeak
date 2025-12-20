// Cache for exchange rate to avoid rate limiting
let cachedRate = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  // Check if we have a valid cached rate
  const now = Date.now();
  if (cachedRate && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
    return res.status(200).json({
      success: true,
      rate: cachedRate,
      cached: true,
    });
  }

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API returned status ${response.status}`);
    }

    const data = await response.json();
    const rate = data?.cardano?.usd;

    if (typeof rate !== "number" || rate <= 0) {
      throw new Error("Invalid rate received from CoinGecko");
    }

    // Cache the rate
    cachedRate = rate;
    cacheTimestamp = now;

    return res.status(200).json({
      success: true,
      rate: rate,
    });
  } catch (error) {
    console.error("Failed to fetch ADA/USD rate:", error);

    // If we have a cached rate, return it even if expired
    if (cachedRate) {
      return res.status(200).json({
        success: true,
        rate: cachedRate,
        cached: true,
        warning: "Using cached rate due to API error",
      });
    }

    // Fallback rate if no cache available
    return res.status(500).json({
      success: false,
      error: "Failed to fetch exchange rate",
    });
  }
}
