import sqlite3
from datetime import datetime

DB_NAME = "polymath.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            content TEXT,
            summary TEXT,
            tags TEXT,
            status TEXT DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def add_item(type, content, summary, tags):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('INSERT INTO items (type, content, summary, tags) VALUES (?, ?, ?, ?)',
              (type, content, summary, tags))
    conn.commit()
    item_id = c.lastrowid
    conn.close()
    return item_id

def get_items():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM items ORDER BY created_at DESC')
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def update_item_status(item_id, status):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('UPDATE items SET status = ? WHERE id = ?', (status, item_id))
    conn.commit()
    conn.close()
