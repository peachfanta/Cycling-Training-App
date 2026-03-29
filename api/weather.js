export default async function handler(req, res) {
  const url =
    "https://my-server.tld/v1/forecast?latitude=-37.8&longitude=145&daily=temperature_2m_max,precipitation_sum,precipitation_probability_max&timezone=Australia%2FSydney&forecast_days=14";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(502).json({ error: "Weather fetch failed" });
      return;
    }
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=10800, stale-while-revalidate=86400");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Weather proxy error" });
  }
}
