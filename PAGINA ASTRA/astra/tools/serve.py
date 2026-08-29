import functools
import http.server

handler = functools.partial(
    http.server.SimpleHTTPRequestHandler,
    directory="/Users/macbookpro/Documents/PAGINA ASTRA/astra",
)
http.server.test(HandlerClass=handler, port=8765)
