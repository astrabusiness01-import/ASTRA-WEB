"""Servidor local sin caché para revisar la plataforma.

Uso:  python3 tools/serve.py   →   http://localhost:8770
"""
import functools
import http.server
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = 8770


class NoStoreHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    handler = functools.partial(NoStoreHandler, directory=str(ROOT))
    print(f"Plataforma ASTRA en http://localhost:{PORT}")
    http.server.ThreadingHTTPServer(("", PORT), handler).serve_forever()
