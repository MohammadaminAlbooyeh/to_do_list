from pathlib import Path

# Define default file path
FILEPATH = Path(__file__).resolve().parent.parent / "files" / "todos.txt"

def get_todos(file_path=FILEPATH):
    """Retrieve todos from a file."""
    if file_path.exists():
        with file_path.open("r", encoding="utf-8") as file:
            return [line.strip() for line in file.readlines()]
    return []

def save_todos(todos, file_path=FILEPATH):
    """Save todos to a file."""
    with file_path.open("w", encoding="utf-8") as file:
        file.writelines(f"{item}\n" for item in todos)

