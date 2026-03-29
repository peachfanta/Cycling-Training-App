export default async function handler(req, res) {
  const primaryUrl =
    "https://my-server.tld/v1/forecast?latitude=-37.8&longitude=145&daily=temperature_2m_max,precipitation_sum,precipitation_probability_max&timezone=Australia%2FSydney&forecast_days=14";
  const fallbackUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=-37.8&longitude=145&daily=temperature_2m_max,precipitation_sum,precipitation_probability_max&timezone=Australia%2FSydney&forecast_days=14";

  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }
    return response.json();
  }

  try {
    let data;
    try {
      data = await fetchJson(primaryUrl);
    } catch (err) {
      data = await fetchJson(fallbackUrl);
    }

    res.setHeader("Cache-Control", "s-maxage=10800, stale-while-revalidate=86400");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Weather proxy error" });
  }
}
