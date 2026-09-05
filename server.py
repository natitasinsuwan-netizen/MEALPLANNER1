#!/usr/bin/env python3
"""
MEALPLANNER1 - Persistent Local & Production Web Server
Serves static frontend assets and handles permanent disk persistence for meals.js
"""

import http.server
import json
import os
import re
import sys
import urllib.parse

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MEALS_JS_PATH = os.path.join(BASE_DIR, "meals.js")
MEALS_JSON_PATH = os.path.join(BASE_DIR, "meals.json")


def load_meals_from_file():
    """Load meals from meals.json or extract from meals.js."""
    if os.path.exists(MEALS_JSON_PATH):
        try:
            with open(MEALS_JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    return data
        except Exception as e:
            print(f"Warning: Failed to load from meals.json: {e}", file=sys.stderr)

    if os.path.exists(MEALS_JS_PATH):
        try:
            with open(MEALS_JS_PATH, "r", encoding="utf-8") as f:
                content = f.read()
            match = re.search(r"const DEFAULT_MEALS = (\[.*?\]);", content, re.DOTALL)
            if match:
                return json.loads(match.group(1))
        except Exception as e:
            print(f"Warning: Failed to load from meals.js: {e}", file=sys.stderr)

    return []


def save_meals_to_disk(meals_data):
    """Write meals array permanently to meals.js and meals.json."""
    # 1. Save to meals.json
    with open(MEALS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(meals_data, f, indent=2, ensure_ascii=False)

    # 2. Save to meals.js formatted cleanly as valid JavaScript
    formatted_json = json.dumps(meals_data, indent=2, ensure_ascii=False)
    js_content = (
        f"const DEFAULT_MEALS = {formatted_json};\n\n"
        f"let INITIAL_MEALS = [...DEFAULT_MEALS];\n"
    )
    with open(MEALS_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)


class MealPlannerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/status":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._set_cors_headers()
            self.end_headers()
            resp = {
                "status": "online",
                "persistence": "disk",
                "meals_file": "meals.js",
                "port": self.server.server_port
            }
            self.wfile.write(json.dumps(resp).encode("utf-8"))
            return

        if path == "/api/meals":
            meals = load_meals_from_file()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(meals, ensure_ascii=False).encode("utf-8"))
            return

        # Default static file handling
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/meals":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_length).decode("utf-8")
                data = json.loads(body)

                if not isinstance(data, list):
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self._set_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Payload must be a JSON array of meals"}).encode("utf-8"))
                    return

                # Save permanently to disk
                save_meals_to_disk(data)
                print(f"[DISK SAVE] Successfully persisted {len(data)} meals permanently to meals.js & meals.json")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self._set_cors_headers()
                self.end_headers()
                resp = {
                    "success": True,
                    "count": len(data),
                    "message": f"Successfully persisted {len(data)} meals permanently to disk!"
                }
                self.wfile.write(json.dumps(resp).encode("utf-8"))
                return

            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self._set_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
                return

        self.send_response(404)
        self.end_headers()


def run(port=8094):
    server_address = ("", port)
    httpd = http.server.HTTPServer(server_address, MealPlannerHandler)
    print("=" * 60)
    print(f" [MEALPLANNER1] Server running at http://localhost:{port}")
    print(f" [DIRECTORY] Serving from: {BASE_DIR}")
    print(" [PERSISTENCE] Disk Persistence: ENABLED (Saves directly to meals.js)")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()


if __name__ == "__main__":
    port = 8094
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    elif "PORT" in os.environ:
        try:
            port = int(os.environ["PORT"])
        except ValueError:
            pass
    run(port)
