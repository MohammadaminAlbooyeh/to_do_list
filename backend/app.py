import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('todo.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/todos', methods=['GET'])
def get_todos():
    conn = get_db_connection()
    todos = conn.execute('SELECT * FROM todos').fetchall()
    conn.close()
    return jsonify([dict(row) for row in todos])

@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    title = data.get('title')
    if not title:
        return jsonify({'error': 'Title is required'}), 400
    conn = get_db_connection()
    conn.execute('INSERT INTO todos (title, done) VALUES (?, ?)', (title, False))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Todo added'}), 201

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    done = data.get('done')
    conn = get_db_connection()
    conn.execute('UPDATE todos SET done = ? WHERE id = ?', (done, todo_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Todo updated'})

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Todo deleted'})

if __name__ == '__main__':
    # Create table if not exists
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT 0
    )''')
    conn.close()
    app.run(host='0.0.0.0', port=5050)
