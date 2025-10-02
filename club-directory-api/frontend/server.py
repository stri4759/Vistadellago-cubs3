from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import urllib.error
import os

FRONTEND_DIR = os.path.abspath('frontend')

class ProxyHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/'):
            self.proxy_to_backend()
        else:
            self.serve_static()
    
    def do_POST(self):
        if self.path.startswith('/api/'):
            self.proxy_to_backend()
        else:
            self.send_error(404)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def proxy_to_backend(self):
        backend_url = f'http://localhost:8080{self.path}'
        
        try:
            if self.command == 'POST':
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                req = urllib.request.Request(backend_url, data=post_data, method='POST')
                req.add_header('Content-Type', 'application/json')
            else:
                req = urllib.request.Request(backend_url)
            
            with urllib.request.urlopen(req) as response:
                data = response.read()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                self.wfile.write(data)
                
        except urllib.error.URLError as e:
            print(f'Error proxying to backend: {e}')
            self.send_error(502, f'Backend unavailable: {e}')
        except Exception as e:
            print(f'Error: {e}')
            self.send_error(500, str(e))
    
    def serve_static(self):
        if self.path == '/' or self.path == '':
            requested_file = 'index.html'
        else:
            requested_file = self.path.lstrip('/')
        
        requested_path = os.path.join(FRONTEND_DIR, requested_file)
        real_path = os.path.realpath(requested_path)
        
        if not real_path.startswith(FRONTEND_DIR + os.sep) and real_path != FRONTEND_DIR:
            print(f'Security: Blocked path traversal attempt: {self.path}')
            self.send_error(403, 'Forbidden')
            return
        
        try:
            if os.path.isfile(real_path):
                if real_path.endswith('.html'):
                    content_type = 'text/html'
                elif real_path.endswith('.css'):
                    content_type = 'text/css'
                elif real_path.endswith('.js'):
                    content_type = 'application/javascript'
                else:
                    content_type = 'text/plain'
                
                with open(real_path, 'rb') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404)
        except Exception as e:
            print(f'Error serving file: {e}')
            self.send_error(500)

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    os.chdir('..')  
    port = int(os.environ.get('PORT', 5000))
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, ProxyHTTPRequestHandler)
    print(f'Starting frontend server with API proxy on http://0.0.0.0:{port}')
    httpd.serve_forever()
