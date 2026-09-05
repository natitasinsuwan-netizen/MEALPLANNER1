import json
import os
import re
from typing import Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="MEALPLANNER1 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
# Check if root static files are in current dir or parent dir
ROOT_DIR = (
    BACKEND_DIR
    if os.path.exists(os.path.join(BACKEND_DIR, "index.html"))
    else os.path.dirname(BACKEND_DIR)
)
MEALS_JS_PATH = os.path.join(ROOT_DIR, "meals.js")
MEALS_JSON_PATH = os.path.join(ROOT_DIR, "meals.json")


def load_meals():
    if os.path.exists(MEALS_JSON_PATH):
        try:
            with open(MEALS_JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    return data
        except Exception:
            pass

    if os.path.exists(MEALS_JS_PATH):
        try:
            with open(MEALS_JS_PATH, "r", encoding="utf-8") as f:
                content = f.read()
            match = re.search(r"const DEFAULT_MEALS = (\[.*?\]);", content, re.DOTALL)
            if match:
                return json.loads(match.group(1))
        except Exception:
            pass

    return []


def save_meals(meals: List[Any]):
    with open(MEALS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(meals, f, indent=2, ensure_ascii=False)

    formatted_json = json.dumps(meals, indent=2, ensure_ascii=False)
    js_content = (
        f"const DEFAULT_MEALS = {formatted_json};\n\n"
        f"let INITIAL_MEALS = [...DEFAULT_MEALS];\n"
    )
    with open(MEALS_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)


@app.get("/api/status")
def get_status():
    return {
        "status": "online",
        "persistence": "disk",
        "meals_file": "meals.js"
    }


@app.get("/api/meals")
def get_meals():
    return load_meals()


@app.post("/api/meals")
def update_meals(meals: List[Any]):
    if not isinstance(meals, list) or len(meals) == 0:
        raise HTTPException(status_code=400, detail="Invalid meals list")
    save_meals(meals)
    return {
        "success": True,
        "count": len(meals),
        "message": f"Successfully persisted {len(meals)} meals permanently to disk!"
    }


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    file_path = os.path.join(ROOT_DIR, full_path)
    if full_path and os.path.isfile(file_path):
        return FileResponse(file_path)
    index_path = os.path.join(ROOT_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "Frontend not found"}
