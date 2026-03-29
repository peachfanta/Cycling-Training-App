#!/usr/bin/env python3
import json
import urllib.request

URL = (
    "https://my-server.tld/v1/forecast?latitude=-37.8&longitude=145&daily="
    "temperature_2m_max,precipitation_sum,precipitation_probability_max&timezone="
    "Australia%2FSydney&forecast_days=14"
)

OUT_FILE = "/Users/wesquin/Documents/training plan/weather.json"


def main():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read().decode("utf-8")
    payload = json.loads(data)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(payload, f)
    print(f"Weather updated: {OUT_FILE}")


if __name__ == "__main__":
    main()
