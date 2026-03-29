#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import urllib.request

DEFAULT_TARGET = (
    "https://my-server.tld/v1/forecast?latitude=-37.8&longitude=145&daily=temperature_2m_max,"
    "precipitation_sum,precipitation_probability_max&timezone=Australia%2FSydney&forecast_days=14"
)

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/forecast"):
            target = DEFAULT_TARGET
            try:
                req = urllib.request.Request(target, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=10) as resp:
                    data = resp.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(data)
            except Exception as exc:
                self.send_response(502)
                self.send_header("Content-Type", "text/plain")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(f"Proxy error: {exc}".encode("utf-8"))
            return
        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        return

if __name__ == "__main__":
    server = HTTPServer(("localhost", 8787), Handler)
    print("Weather proxy running at http://localhost:8787/forecast")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
