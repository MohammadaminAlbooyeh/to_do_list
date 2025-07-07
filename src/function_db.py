import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "files" / "todos.db"

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL
            )
        """)

def get_todos():
    with sqlite3.connect(DB_PATH) as conn:
        rows = conn.execute("SELECT text FROM todos").fetchall()
        return [row[0] for row in rows]

def add_todo(text):
    print("Writing to:", DB_PATH)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("INSERT INTO todos (text) VALUES (?)", (text,))

def update_todo(old_text, new_text):
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("UPDATE todos SET text = ? WHERE text = ?", (new_text, old_text))

def delete_todo(text):
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("DELETE FROM todos WHERE text = ?", (text,))
